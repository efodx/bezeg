import {Board} from "jsxgraph";
import {Point} from "./Point";
import {PointControlledCurve} from "../../bezeg/interfaces/point-controlled-curve";
import {CacheContext, SizeContext} from "../../Contexts"
import {PointStyles} from "../styles/PointStyles";
import {CurveStyles} from "../styles/CurveStyles";
import {SegmentStyles} from "../styles/SegmentStyles";

/**
 * Class that wraps a PointControlledCurve with methods for dealing with JSXGraph
 */
export abstract class AbstractJSXPointControlledCurve<T extends PointControlledCurve> {
    coords?: JXG.Coords;
    jxgPoints: JXG.Point[] = []
    protected readonly pointControlledCurve: T
    protected readonly board: Board
    private jxgCurve: JXG.Curve
    private boundBoxPoints: JXG.Point[] = []
    private boundBoxSegments: JXG.Segment[] = []
    private convexHullSegments: JXG.Segment[] = []
    private selected: boolean = false
    private dragging: boolean = false
    private rotating: boolean = false
    private resizing: boolean = false
    private intervalStart: number | (() => number) = 0;
    private intervalEnd: number | (() => number) = 1;
    private controlPolygonSegments: JXG.Segment[] = []
    private showingControlPolygon: boolean = false;
    private showingJxgPoints: boolean = true;
    private showingConvexHull: boolean = false;
    private rotationCenter?: number[];
    private readonly convexHullRefresher = this.refreshConvexHull.bind(this)

    constructor(points: number[][], board: Board) {
        this.board = board
        this.pointControlledCurve = this.getStartingCurve(points)
        this.jxgCurve = this.board.create('curve',
            [(t: number) => {
                return this.pointControlledCurve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return this.pointControlledCurve.calculatePointAtT(t).Y();
                },
                () => {
                    if (typeof this.intervalStart == "number") {
                        return this.intervalStart
                    }
                    return this.intervalStart()
                },
                () => {
                    if (typeof this.intervalEnd == "number") {
                        return this.intervalEnd
                    }
                    return this.intervalEnd()
                }],
            CurveStyles.default
        );
        this.addBoundingBox()
        this.hideBoundingBox()
        this.board.on("update", this.convexHullRefresher)
    }

    isShowingControlPolygon() {
        return this.showingControlPolygon
    }

    setIntervalStart(t: number | (() => number)) {
        this.intervalStart = t
    }

    setIntervalEnd(t: number | (() => number)) {
        this.intervalEnd = t
    }

    addPoint(x: number, y: number) {
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length))
        this.pointControlledCurve.addPoint(p)
        this.labelJxgPoints()
    }

    removePoint(i: number) {
        this.board.removeObject(this.jxgPoints[i])
        this.pointControlledCurve.removePoint(this.pointControlledCurve.getPoints()[i])
        this.jxgPoints.splice(i, 1)
        this.labelJxgPoints()
    }

    labelJxgPoints() {
        this.getJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i).name as string))
    }

    move(newCoords: JXG.Coords) {
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]]
        this.pointControlledCurve.moveFor(dx, dy)
    }

    resize(newCoords: JXG.Coords) {
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox()
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]]
        let [xDir, yDir] = this.getResizingDir()
        dx = dx * xDir
        dy = dy * yDir
        let xScale = (2 * dx + maxX - minX) / (maxX - minX)
        let yScale = (2 * dy + maxY - minY) / (maxY - minY)
        this.pointControlledCurve.scale(xScale, yScale)
    }

    rotate(newCoords: JXG.Coords) {
        let [xCenter, yCenter] = this.rotationCenter!
        let k1, k2
        k1 = (yCenter - newCoords.usrCoords[2]) / (xCenter - newCoords.usrCoords[1])
        k2 = (yCenter - this.coords!.usrCoords[2]) / (xCenter - this.coords!.usrCoords[1])
        let theta = Math.atan((k1 - k2) / (1 + k1 * k2))
        this.pointControlledCurve.rotate(theta)
        //
        // let newCenter = this.pointControlledCurve.getBoundingBoxCenter()
        // let [dx, dy] = [newCenter[0] - this.rotationCenter![0], newCenter[1] - this.rotationCenter![1]]
        // this.pointControlledCurve.moveFor(-dx, -dy)
    }

    processMouseUp(e: PointerEvent) {
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.stopDragging()
            this.move(newCoords)
            return
        }
        if (this.resizing) {
            this.stopResizing()
            this.resize(newCoords)
            return
        }
        if (this.rotating) {
            this.stopRotating()
            this.rotate(newCoords)
            return
        }
    }

    isSelectable(e: PointerEvent) {
        let coords = this.getMouseCoords(e);
        // @ts-ignore
        return this.jxgCurve?.hasPoint(coords.scrCoords[1], coords.scrCoords[2])
        //&& !this.jxgPoints.some(point => point.hasPoint(coords.scrCoords[1], coords.scrCoords[2]))
    }

    processMouseDown(e: PointerEvent) {
        console.time("Processing mouse down event")
        this.coords = this.getMouseCoords(e);
        // @ts-ignore
        // @ts-ignore
        if (this.boundBoxPoints?.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) && this.selected) {
            this.startResizing()
        } else if (!this.isMouseInsideBoundingBox() && this.isMouseInsidePaddedBoundingBox() && this.selected) {
            this.startRotating()
        }
        if (this.selected && !this.resizing && !this.rotating) {
            this.startDragging()
        }
        console.timeEnd("Processing mouse down event")
    }

    processMouseMove(e: PointerEvent) {
        console.time("Processing mouse move event")
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.move(newCoords)
        }
        if (this.resizing) {
            this.resize(newCoords)
        }
        if (this.rotating) {
            this.rotate(newCoords)
        }
        this.board.update()
        this.coords = newCoords
        CacheContext.context = CacheContext.context + 1
        console.timeEnd("Processing mouse move event")
    }

    getResizingDir(): number[] {
        // @ts-ignore
        if (this.boundBoxPoints[0].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, -1]
        }
        // @ts-ignore
        if (this.boundBoxPoints[1].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, 1]
        }
        // @ts-ignore
        if (this.boundBoxPoints[2].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [1, 1]
        }
        return [1, -1]
    }

    startResizing() {
        this.resizing = true
    }

    stopResizing() {
        this.resizing = false
    }

    startDragging() {
        this.dragging = true
    }

    stopDragging() {
        this.dragging = false
    }

    startRotating() {
        this.rotating = true
        this.rotationCenter = this.pointControlledCurve.getBoundingBoxCenter()
        this.hideBoundingBox()
    }

    stopRotating() {
        this.rotating = false
        this.showBoundingBox()
    }

    showControlPolygon() {
        this.showControlPolygonInternal()
        this.showingControlPolygon = true
    }

    hideControlPolygon() {
        this.controlPolygonSegments.forEach(segment => segment.hide());
        this.showingControlPolygon = false
    }

    select() {
        if (this.selected) {
            return
        }
        this.jxgPoints.forEach(point => point.setAttribute({fixed: true}))
        this.showBoundingBox()
        this.selected = true
    }

    deselect() {
        if (!this.selected) {
            return
        }
        this.jxgPoints.forEach(point => point.setAttribute({fixed: false}))
        this.hideBoundingBox()
        this.selected = false
    }

    isSelected() {
        return this.selected
    }

    getCurve() {
        return this.pointControlledCurve
    }

    getJxgCurve() {
        return this.jxgCurve
    }

    getJxgPoints() {
        return this.jxgPoints
    }

    showBoundingBox() {
        this.boundBoxSegments.map(segment => segment.show())
        this.boundBoxPoints.map(point => point.show())
    }

    hideBoundingBox() {
        this.boundBoxSegments.map(segment => segment.hide())
        this.boundBoxPoints.map(point => point.hide())
    }

    isMouseInsideBoundingBox() {
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox()
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    isMouseInsidePaddedBoundingBox() {
        // this is so we can actually rotate and resize the curve
        let padding = 0.3
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox()
        minX = minX - padding
        maxX = maxX + padding
        minY = minY - padding
        maxY = maxY + padding
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    hideJxgPoints() {
        this.getJxgPoints().forEach(point => point.hide())
        this.showingJxgPoints = false
    }

    showJxgPoints() {
        this.getJxgPoints().forEach(point => point.show())
        this.showingJxgPoints = true
    }

    isShowingJxgPoints() {
        return this.showingJxgPoints
    }

    hasPoint(x: number, y: number) {
        return this.jxgCurve.hasPoint(x, y)
    }

    showConvexHull(show: boolean) {
        if (show) {
            this.showingConvexHull = true
        } else {
            this.showingConvexHull = false
        }
        this.board.update()
    }

    isShowingConvexHull() {
        return this.showingConvexHull
    }

    protected abstract getStartingCurve(points: number[][]): T

    /**
     * Creates a JSXGraph point ands wraps it with the Point interface.
     * @param x
     * @param y
     * @param opts
     */
    protected createJSXGraphPoint(x: number | (() => number), y: number | (() => number), opts?: any): Point {
        let point: JXG.Point;
        if (opts) {
            point = this.board.create('point', [x, y], opts);
        } else {
            point = this.board.create('point', [x, y]);
        }
        this.jxgPoints.push(point)
        return new Point(point);
    }

    protected movePointsToNewPoints(newPoints: any[]) {
        newPoints.forEach(
            (point, i) => {
                this.pointControlledCurve.getPoints()[i].setX(point.X())
                this.pointControlledCurve.getPoints()[i].setY(point.Y())
            }
        )
    }

    /**
     * Removes jxgPoints from the board and empties the jxgPoints array.
     * @private
     */
    protected clearJxgPoints() {
        this.board.removeObject(this.jxgPoints)
        this.jxgPoints = []
    }

    protected showControlPolygonInternal() {
        if (this.controlPolygonSegments.length !== 0 && (this.controlPolygonSegments.length + 1 === this.pointControlledCurve.getPoints().length)) {
            this.controlPolygonSegments.forEach(segment => segment.show())
        } else {
            this.board!.removeObject(this.controlPolygonSegments)
            this.controlPolygonSegments = []
            for (let i = 1; i < this.jxgPoints.length; i = i + 1) {
                const segment = this.board.create('segment', [this.jxgPoints[i - 1], this.jxgPoints[i]], SegmentStyles.default);
                this.controlPolygonSegments.push(segment)
            }
        }
    }

    private hideHullInternal() {
        this.board.removeObject(this.convexHullSegments)
        this.convexHullSegments = []
    }

    private showHullInternal() {
        const hull = this.getCurve().getConvexHull()
        const jxgPoints = hull.map(p => this.jxgPoints.filter(point => point.X() === p.X() && point.Y() === p.Y())[0])
        const segments = jxgPoints.slice(1).map((p, i) => this.board.create('segment', [jxgPoints[i], p], {strokeWidth: () => SizeContext.strokeWidth}))
        this.convexHullSegments.push(...segments)
        const lastSegment = this.board.create('segment', [jxgPoints[jxgPoints.length - 1], jxgPoints[0]], {strokeWidth: () => SizeContext.strokeWidth})
        this.convexHullSegments.push(lastSegment)
    }

    private addBoundingBox() {
        const pointStyle = {name: "", color: "gray", opacity: 0.4, size: () => SizeContext.pointSize}
        const p = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[0], () => this.pointControlledCurve.getBoundingBox()[2]], pointStyle);
        const p2 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[0], () => this.pointControlledCurve.getBoundingBox()[3]], pointStyle);
        const p3 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[1], () => this.pointControlledCurve.getBoundingBox()[3]], pointStyle);
        const p4 = this.board.create('point', [() => this.pointControlledCurve.getBoundingBox()[1], () => this.pointControlledCurve.getBoundingBox()[2]], pointStyle);
        // @ts-ignore
        this.boundBoxPoints = [p, p2, p3, p4]


        const segmentStyle = {color: "gray", strokeWidth: 0.5, dash: 2, highlight: false}
        const segment = this.board.create('segment', [p, p2], segmentStyle);
        const segment2 = this.board.create('segment', [p2, p3], segmentStyle);
        const segment3 = this.board.create('segment', [p3, p4], segmentStyle);
        const segment4 = this.board.create('segment', [p4, p], segmentStyle);
        // @ts-ignore
        this.boundBoxSegments = [segment, segment2, segment3, segment4]
    }

    private getMouseCoords(e: PointerEvent) {
        const pos = this.board.getMousePosition(e);
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);
    }

    private refreshConvexHull() {
        if (this.showingConvexHull) {
            this.hideHullInternal()
            this.showHullInternal()
        } else {
            this.hideHullInternal()
        }
    }
}