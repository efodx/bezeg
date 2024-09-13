import {Board, PointAttributes} from "jsxgraph";
import {JXGPointWrapper} from "./JXGPointWrapper";
import {PointControlledCurveCommands} from "./inputs/PointControlledCurveCommands";
import {PointControlledCurve} from "../../../bezeg/api/curve/point-controlled-curve";
import {CurveStyles} from "../../styles/CurveStyles";
import {PointStyles} from "../../styles/PointStyles";
import {CacheContext} from "../../context/CacheContext";
import {SizeContext} from "../../context/SizeContext";
import {SegmentStyles} from "../../styles/SegmentStyles";

export interface PointControlledCurveAttributes {
    allowShowControlPolygon: boolean
    allowShowConvexHull: boolean,
    allowShowPoints: boolean,
    selectable: boolean | undefined
}

export interface PointControlledCurveState {
    showingControlPolygon: boolean;
    showingJxgPoints: boolean;
    showingConvexHull: boolean;
}

/**
 * Class that wraps a PointControlledCurve with methods for dealing with JSXGraph
 */
export abstract class AbstractJXGPointControlledCurve<T extends PointControlledCurve, Attr extends PointControlledCurveAttributes> {
    coords?: JXG.Coords;
    jxgPoints: JXG.Point[] = [];
    readonly pointControlledCurve: T;
    readonly board: Board;
    protected boundBoxPoints: JXG.Point[] = [];
    protected resizingStart: JXG.Point | undefined;
    private jxgCurve: JXG.Curve;
    private boundBoxSegments: JXG.Segment[] = [];
    private convexHullSegments: JXG.Segment[] = [];
    private selected: boolean = false;
    private dragging: boolean = false;
    private rotating: boolean = false;
    private resizing: boolean = false;
    private intervalStart: number | (() => number) = 0;
    private intervalEnd: number | (() => number) = 1;
    private controlPolygonSegments: JXG.Segment[] = [];
    private showingControlPolygon: boolean = false;
    private showingJxgPoints: boolean = true;
    private showingConvexHull: boolean = false;
    private rotationCenter?: number[];
    private readonly convexHullRefresher = this.refreshConvexHull.bind(this);
    private attributes: Attr = {allowShowControlPolygon: true} as Attr;

    constructor(points: number[][], board: Board, attributes?: Attr) {
        this.board = board;
        this.setAttributes(this.getDefaultAttributes());
        if (attributes) {
            this.setAttributes(attributes);
        }
        this.pointControlledCurve = this.getInitialCurve(points);
        // TODO the starting curve is hardly ever actually used... Maybe think differently about this.
        this.jxgCurve = this.board.create('curve',
            [(t: number) => {
                return this.pointControlledCurve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return this.pointControlledCurve.calculatePointAtT(t).Y();
                },
                () => {
                    if (typeof this.intervalStart == "number") {
                        return this.intervalStart;
                    }
                    return this.intervalStart();
                },
                () => {
                    if (typeof this.intervalEnd == "number") {
                        return this.intervalEnd;
                    }
                    return this.intervalEnd();
                }],
            CurveStyles.default
        );
        this.addBoundingBox();
        this.hideBoundingBox();
        this.board.on("update", this.convexHullRefresher);
    }

    getDefaultAttributes(): Attr {
        return {allowShowControlPolygon: true, allowShowConvexHull: true} as Attr;
    }


    isShowingControlPolygon() {
        return this.showingControlPolygon;
    }

    setIntervalStart(t: number | (() => number)) {
        this.intervalStart = t;
    }

    setIntervalEnd(t: number | (() => number)) {
        this.intervalEnd = t;
    }

    addPoint(x: number, y: number) {
        CacheContext.update();
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length, () => this.isShowingJxgPoints()));
        this.pointControlledCurve.addPoint(p);
        this.labelJxgPoints();
    }

    removePoint(i: number) {
        this.board.removeObject(this.jxgPoints[i]);
        this.pointControlledCurve.removePoint(this.pointControlledCurve.getPoints()[i]);
        this.jxgPoints.splice(i, 1);
        this.labelJxgPoints();
    }

    labelJxgPoints() {
        this.getJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
    }

    move(newCoords: JXG.Coords) {
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]];
        this.pointControlledCurve.moveFor(dx, dy);
    }

    resize(newCoords: JXG.Coords) {
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox();
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]];
        let [xDir, yDir] = this.getResizingDir();
        dx = dx * xDir;
        dy = dy * yDir;
        let xScale = (2 * dx + maxX - minX) / (maxX - minX);
        let yScale = (2 * dy + maxY - minY) / (maxY - minY);
        this.pointControlledCurve.scale(xScale, yScale);
    }

    rotate(newCoords: JXG.Coords) {
        let [xCenter, yCenter] = this.rotationCenter!;
        let k1, k2;
        k1 = (yCenter - newCoords.usrCoords[2]) / (xCenter - newCoords.usrCoords[1]);
        k2 = (yCenter - this.coords!.usrCoords[2]) / (xCenter - this.coords!.usrCoords[1]);
        let theta = Math.atan((k1 - k2) / (1 + k1 * k2));
        this.pointControlledCurve.rotate(theta);
    }

    processMouseUp(e: PointerEvent) {
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.stopDragging();
            this.move(newCoords);
            return;
        }
        if (this.resizing) {
            this.stopResizing();
            this.resize(newCoords);
            return;
        }
        if (this.rotating) {
            this.stopRotating();
            this.rotate(newCoords);
            return;
        }
    }

    isSelectable(e: PointerEvent) {
        if (this.attributes.selectable === false) {
            return false;
        }
        let coords = this.getMouseCoords(e);
        // @ts-ignore
        return this.jxgCurve?.hasPoint(coords.scrCoords[1], coords.scrCoords[2]);
        //&& !this.jxgPoints.some(point => point.hasPoint(coords.scrCoords[1], coords.scrCoords[2]))
    }

    processMouseDown(e: PointerEvent) {
        console.time("Processing mouse down event");
        this.coords = this.getMouseCoords(e);
        // @ts-ignore
        if (this.selected && this.boundBoxPoints?.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2]))) {
            this.startResizing();
        } else if (this.selected && !this.isMouseInsideBoundingBox() && this.isMouseInsidePaddedBoundingBox()) {
            this.startRotating();
        }
        if (this.selected && !this.resizing && !this.rotating) {
            this.startDragging();
        }
        console.timeEnd("Processing mouse down event");
    }

    processMouseMove(e: PointerEvent) {
        console.time("Processing mouse move event");
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.move(newCoords);
        }
        if (this.resizing) {
            this.resize(newCoords);
        }
        if (this.rotating) {
            this.rotate(newCoords);
        }
        this.board.update();
        this.coords = newCoords;
        console.timeEnd("Processing mouse move event");
    }

    needToProcessMoveEvent() {
        return this.dragging || this.resizing || this.rotating;
    }

    getResizingDir(): number[] {
        // @ts-ignore
        if (this.boundBoxPoints[0].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, -1];
        }
        // @ts-ignore
        if (this.boundBoxPoints[1].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, 1];
        }
        // @ts-ignore
        if (this.boundBoxPoints[2].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [1, 1];
        }
        return [1, -1];
    }

    startResizing() {
        // @ts-ignore
        this.resizingStart = this.boundBoxPoints?.filter(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2]))[0]!;
        this.resizing = true;
    }

    stopResizing() {
        this.resizing = false;
    }

    startDragging() {
        this.dragging = true;
    }

    stopDragging() {
        this.dragging = false;
    }

    startRotating() {
        this.rotating = true;
        this.rotationCenter = [this.jxgPoints.map(point => point.X()).reduce((previousValue, currentValue) => previousValue + currentValue) / this.jxgPoints.length,
            this.jxgPoints.map(point => point.Y()).reduce((previousValue, currentValue) => previousValue + currentValue) / this.jxgPoints.length];
        this.hideBoundingBox();
    }

    stopRotating() {
        this.rotating = false;
        this.showBoundingBox();
    }

    showControllPolygon(show: boolean) {
        if (show) {
            this.showControlPolygon();
        } else {
            this.hideControlPolygon();
        }
    }

    showControlPolygon() {
        this.showControlPolygonInternal();
        this.showingControlPolygon = true;
    }

    hideControlPolygon() {
        this.controlPolygonSegments.forEach(segment => segment.hide());
        this.showingControlPolygon = false;
    }

    select() {
        if (this.selected) {
            return;
        }
        this.jxgPoints.forEach(point => point.setAttribute({fixed: true}));
        this.showBoundingBox();
        this.selected = true;
    }

    deselect() {
        if (!this.selected) {
            return;
        }
        this.jxgPoints.forEach(point => point.setAttribute({fixed: false}));
        this.hideBoundingBox();
        this.selected = false;
    }

    isSelected() {
        return this.selected;
    }

    getCurve() {
        return this.pointControlledCurve;
    }

    getJxgCurve() {
        return this.jxgCurve;
    }

    getJxgPoints(): JXG.Point[] {
        return this.jxgPoints;
    }

    showBoundingBox() {
        this.boundBoxSegments.map(segment => segment.show());
        this.boundBoxPoints.map(point => point.show());
    }

    hideBoundingBox() {
        this.boundBoxSegments.map(segment => segment.hide());
        this.boundBoxPoints.map(point => point.hide());
    }

    isMouseInsideBoundingBox() {
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox();
        let x = this.coords!.usrCoords[1];
        let y = this.coords!.usrCoords[2];
        return (x < maxX && x > minX && y < maxY && y > minY);
    }

    isMouseInsidePaddedBoundingBox() {
        // this is so we can actually rotate and resize the curve
        let padding = 0.3;
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox();
        minX = minX - padding;
        maxX = maxX + padding;
        minY = minY - padding;
        maxY = maxY + padding;
        let x = this.coords!.usrCoords[1];
        let y = this.coords!.usrCoords[2];
        return (x < maxX && x > minX && y < maxY && y > minY);
    }

    hideJxgPoints() {
        this.showingJxgPoints = false;
    }

    showJxgPoints(show?: boolean) {
        if (show === undefined || show) {
            this.showingJxgPoints = true;
        } else {
            this.hideJxgPoints();
        }
    }


    isShowingJxgPoints() {
        return this.showingJxgPoints;
    }

    hasPoint(x: number, y: number) {
        return this.jxgCurve.hasPoint(x, y);
    }

    showConvexHull(show: boolean) {
        if (show) {
            this.showingConvexHull = true;
        } else {
            this.showingConvexHull = false;
        }
        this.board.update();
    }

    isShowingConvexHull() {
        return this.showingConvexHull;
    }

    getCurveCommands(): JSX.Element[] {
        if (this.attributes.allowShowControlPolygon) {
            return PointControlledCurveCommands(this);
        }
        return [];
    }

    getAttributes(): Attr {
        return this.attributes;
    }

    exportState() {
        return {
            showingJxgPoints: this.showingJxgPoints,
            showingControlPolygon: this.showingControlPolygon,
            showingConvexHull: this.showingConvexHull,

        } as PointControlledCurveState;
    }

    importState(state: PointControlledCurveState) {
        this.showConvexHull(state.showingConvexHull);
        this.showControllPolygon(state.showingControlPolygon);
        this.showJxgPoints(state.showingJxgPoints);
    }

    setAttributes(attributes: Attr) {
        this.attributes = {...this.attributes, ...attributes};
    }

    showJxgPointss(show: boolean) {
        this.board.suspendUpdate();
        if (show) {
            this.showJxgPoints();
        } else {
            this.hideJxgPoints();
        }
        this.board.unsuspendUpdate();
    }

    processMouseCursor(e: PointerEvent) {
        const newCoords = this.getMouseCoords(e);
        const oldCoords = this.coords;
        this.coords = newCoords;

        if (this.isMouseInsideBoundingBox()) {
            this.board.containerObj.style.cursor = 'move';
        } else if (!this.isMouseInsideBoundingBox() && this.isMouseInsidePaddedBoundingBox()) {
            this.board.containerObj.style.cursor = 'pointer';
        } else {
            this.board.containerObj.style.cursor = 'default';
        }
        this.boundBoxPoints.forEach((p, i) => {
            // @ts-ignore
            if (p.hasPoint(this.coords?.scrCoords[1], this.coords?.scrCoords[2])) {
                this.board.containerObj.style.cursor = i % 2 != 0 ? 'nwse-resize' : 'nesw-resize';
            }
        });

        this.coords = oldCoords;
    }

    protected abstract getInitialCurve(points: number[][]): T

    /**
     * Creates a JSXGraph point ands wraps it with the Point interface.
     * @param x
     * @param y
     * @param opts
     */
    protected createJSXGraphPoint(x: number | (() => number), y: number | (() => number), opts?: any): JXGPointWrapper {
        let point: JXG.Point;
        if (opts) {
            point = this.board.create('point', [x, y], opts);
        } else {
            point = this.board.create('point', [x, y]);
        }
        let over = (p: JXG.Point) => {
            // @ts-ignore
            if (!p.visProp.fixed) {
                this.board.containerObj.style.cursor = 'pointer';
            }
        };
        let out = (p: JXG.Point) => {
            if (!p.visProp.fixed) {
                this.board.containerObj.style.cursor = 'default';
            }
        };

        point.on('over', () => over(point));
        point.on('out', () => out(point));
        point.on('drag', (e) => {
            CacheContext.update();
        });
        this.jxgPoints.push(point);
        return new JXGPointWrapper(point);
    }

    protected movePointsToNewPoints(newPoints: any[]) {
        newPoints.forEach(
            (point, i) => {
                this.pointControlledCurve.getPoints()[i].setX(point.X());
                this.pointControlledCurve.getPoints()[i].setY(point.Y());
            }
        );
    }

    /**
     * Removes jxgPoints from the board and empties the jxgPoints array.
     * @private
     */
    protected clearJxgPoints() {
        this.board.removeObject(this.jxgPoints);
        this.jxgPoints = [];
    }

    protected showControlPolygonInternal() {
        if (this.controlPolygonSegments.length !== 0 && (this.controlPolygonSegments.length + 1 === this.pointControlledCurve.getPoints().length)) {
            this.controlPolygonSegments.forEach(segment => segment.show());
        } else {
            this.board!.removeObject(this.controlPolygonSegments);
            this.controlPolygonSegments = [];

            const segmentPoints = this.getJxgPoints();
            for (let i = 1; i < segmentPoints.length; i = i + 1) {
                const segment = this.board.create('segment', [segmentPoints[i - 1], segmentPoints[i]], SegmentStyles.default);
                this.controlPolygonSegments.push(segment);
            }
        }
    }

    private hideHullInternal() {
        this.board.removeObject(this.convexHullSegments);
        this.convexHullSegments = [];
    }

    private showHullInternal() {
        const hull = this.getCurve().getConvexHull();
        const jxgPoints = hull.map(p => this.jxgPoints.filter(point => point.X() === p.X() && point.Y() === p.Y())[0]);
        if (jxgPoints.filter(p => p !== undefined).length !== hull.length) {
            console.debug("WE SHOULDN'T COME HERE, ASYNC STUFF IS SCARY!!");
            return;
        }
        const segments = jxgPoints.slice(1).map((p, i) => this.board.create('segment', [jxgPoints[i], p], {strokeWidth: () => SizeContext.strokeWidth}));
        this.convexHullSegments.push(...segments);
        const lastSegment = this.board.create('segment', [jxgPoints[jxgPoints.length - 1], jxgPoints[0]], {strokeWidth: () => SizeContext.strokeWidth});
        this.convexHullSegments.push(lastSegment);
    }

    private addBoundingBox() {
        var board = this.board;
        let over = function (p: JXG.Point) {
            // @ts-ignore
            if (!p.visProp.fixed) {
                board.containerObj.style.cursor = 'pointer';
            }
        };
        let out = function (p: JXG.Point) {
            if (!p.visProp.fixed) {
                board.containerObj.style.cursor = 'default';
            }
        };
        // @ts-ignore
        const pointStyle: PointAttributes = {name: "", color: "gray", opacity: 0.4, size: () => SizeContext.pointSize};
        const p = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[0], () => this.pointControlledCurve.getBoundingBox()[2]], pointStyle);
        const p2 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[0], () => this.pointControlledCurve.getBoundingBox()[3]], pointStyle);
        const p3 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[1], () => this.pointControlledCurve.getBoundingBox()[3]], pointStyle);
        const p4 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[1], () => this.pointControlledCurve.getBoundingBox()[2]], pointStyle);
        // @ts-ignore
        this.boundBoxPoints = [p, p2, p3, p4];
        this.boundBoxPoints.forEach(p => p.on('over', () => over(p)));
        this.boundBoxPoints.forEach(p => p.on('out', () => out(p)));

        const segmentStyle = {color: "gray", strokeWidth: 0.5, dash: 2, highlight: false};
        const segment = this.board.create('segment', [p, p2], segmentStyle);
        const segment2 = this.board.create('segment', [p2, p3], segmentStyle);
        const segment3 = this.board.create('segment', [p3, p4], segmentStyle);
        const segment4 = this.board.create('segment', [p4, p], segmentStyle);
        // @ts-ignore
        this.boundBoxSegments = [segment, segment2, segment3, segment4];
    }

    private getMouseCoords(e: PointerEvent) {
        const pos = this.board.getMousePosition(e);
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);
    }

    private refreshConvexHull() {
        if (this.showingConvexHull) {
            this.hideHullInternal();
            this.showHullInternal();
        } else {
            this.hideHullInternal();
        }
    }
}