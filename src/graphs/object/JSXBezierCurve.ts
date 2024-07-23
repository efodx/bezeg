import {BezierCurveImpl} from "../../bezeg/impl/curve/bezier-curve-impl";
import {AbstractJSXBezierCurve, BezierCurveAttributes} from "./AbstractJSXBezierCurve";
import {Point} from "../../bezeg/api/point/point";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";
import {Colors} from "../bezier/utilities/Colors";
import {PointStyles} from "../styles/PointStyles";
import {SegmentStyles} from "../styles/SegmentStyles";
import {CacheContext} from "../context/CacheContext";
import {BezierCurveCommands} from "./inputs/BezierCurveCommands";
import {Board} from "jsxgraph";
import {PointControlledCurveState} from "./AbstractJSXPointControlledCurve";

export interface JSXBezierCurveConstructorParams {
    points: number[][],
    state: JSXBezierCurveState
}

export interface JSXBezierCurveState extends PointControlledCurveState {
    subdivisionT: number
    decasteljauT: number
    extrapolationT: number
    showingDecasteljauScheme: boolean
}

/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
export class JSXBezierCurve extends AbstractJSXBezierCurve<BezierCurve, BezierCurveAttributes> {
    private subdivisionT: number = 0.5;
    private decasteljauT: number = 0.5;
    private decasteljauSegments: JXG.Segment[] = []
    private decasteljauPoints: JXG.Point[] = []
    private lastDecasteljauT: number | null = null;
    private showingDecasteljauScheme: boolean = false;
    private extrapolationT: number = 1.2;
    private subdivisionPoint: JXG.Point | null = null;
    private extrapolationPoint: JXG.Point | null = null;
    private cachedDecasteljauScheme: Point[][] = [];
    private cacheContext: number = -1;
    private lastDecasteljauN: number = -1;

    static toStr(curve: JSXBezierCurve): JSXBezierCurveConstructorParams {
        return {
            points: curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        }
    }

    static fromStr(params: JSXBezierCurveConstructorParams, board: Board): JSXBezierCurve {
        const curve = new JSXBezierCurve(params.points, board)
        if (params.state) {
            board.suspendUpdate()
            curve.importState(params.state)
            board.unsuspendUpdate()
        }
        return curve
    }

    override importState(state: JSXBezierCurveState) {
        super.importState(state);
        this.setSubdivisionT(state.subdivisionT)
        this.setDecasteljauT(state.decasteljauT)
        this.setExtrapolationT(state.extrapolationT)
        if (!state.showingDecasteljauScheme) {
            this.hideDecasteljauScheme()
        }
    }

    override exportState(): JSXBezierCurveState {
        return {
            ...super.exportState(),
            showingDecasteljauScheme: this.showingDecasteljauScheme,
            subdivisionT: this.subdivisionT,
            decasteljauT: this.decasteljauT,
            extrapolationT: this.extrapolationT
        } as JSXBezierCurveState
    }

    override getDefaultAttributes(): BezierCurveAttributes {
        return {
            ...super.getDefaultAttributes(),
            allowSubdivision: true,
            allowShowControlPolygon: true,
            allowDecasteljau: true,
            allowElevation: true,
            allowExtrapolation: true,
            allowShowPoints: true,
            allowShrink: true
        };
    }

    override hideControlPolygon() {
        super.hideControlPolygon();
        if (this.isShowingDecasteljauScheme()) {
            this.showControlPolygonInternal()
        }
    }

    override getCurveCommands(): JSX.Element[] {
        return super.getCurveCommands().concat(...BezierCurveCommands(this));
    }

    isShowingDecasteljauScheme() {
        return this.showingDecasteljauScheme
    }


    hideDecasteljauScheme() {
        // @ts-ignore
        this.decasteljauPoints.concat(this.decasteljauSegments).forEach(el => el.hide())
        this.showingDecasteljauScheme = false;
        if (!this.isShowingControlPolygon()) {
            this.hideControlPolygon()
        }
    }

    showDecasteljauScheme() {
        if ((this.getCurve().getPoints().length > 2) && this.lastDecasteljauN != this.pointControlledCurve.getPoints().length) {
            this.lastDecasteljauN = this.pointControlledCurve.getPoints().length
            this.generateLineSegments()
        } else {
            // @ts-ignore
            this.decasteljauPoints.concat(this.decasteljauSegments).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
    }

    generateLineSegments() {
        // @ts-ignore
        this.board.removeObject(this.decasteljauPoints.concat(this.decasteljauSegments))
        this.decasteljauSegments = []
        this.decasteljauPoints = []
        const n = this.pointControlledCurve.getPoints().length
        this.showControlPolygonInternal()
        for (let r = 1; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                let pp1 = null;
                let pp2 = null;
                if (i === 1) {
                    // @ts-ignore
                    pp1 = this.board.create('point', [() => this.getDecasteljauScheme(this.decasteljauT)[r][i - 1].X(),
                        () => this.getDecasteljauScheme(this.decasteljauT)[r][i - 1].Y()], {
                        ...PointStyles.default,
                        color: Colors[r]
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(this.decasteljauT)[r][i].X(),
                    () => this.getDecasteljauScheme(this.decasteljauT)[r][i].Y()], {
                    ...PointStyles.default,
                    color: Colors[r]
                });
                const segment = this.board!.create('segment', [pp1, pp2], SegmentStyles.default);
                this.decasteljauSegments.push(segment)
                // @ts-ignore
                this.decasteljauPoints.push(pp1)
                // @ts-ignore
                this.decasteljauPoints.push(pp2)
            }
        }
        const drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(this.decasteljauT)[n - 1][0].X(), () => this.getDecasteljauScheme(this.decasteljauT)[n - 1][0].Y()], {
            ...PointStyles.default,
            color: Colors[n - 1]
        });

        if (drawingPoint instanceof JXG.Point) {
            this.decasteljauPoints.push(drawingPoint)
        }

    }

    getDecasteljauScheme(t: number) {
        const cacheContext = CacheContext.context
        if (this.cacheContext === cacheContext) {
            return this.cachedDecasteljauScheme
        } else {
            this.cachedDecasteljauScheme = this.pointControlledCurve.decasteljauScheme(t)
            this.cacheContext = cacheContext;
            return this.cachedDecasteljauScheme
        }
    }

    getJsxDecasteljauPoints() {
        return this.decasteljauPoints
    }

    override addPoint(x: number, y: number) {
        super.addPoint(x, y);
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    override removePoint(i: number) {
        super.removePoint(i);
        if (this.lastDecasteljauT != null) {
            this.generateLineSegments()
        }
        if (!this.showingDecasteljauScheme) {
            this.hideDecasteljauScheme()
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    subdivide(t?: number): this {
        if (t === undefined) {
            t = this.subdivisionT
        }
        const [curve1, curve2]: BezierCurve[] = this.pointControlledCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        const newJsxCurve = new JSXBezierCurve(curve2pointArray, this.board) as this
        newJsxCurve.setAttributes(this.getAttributes())
        if (this.subdivisionResultConsumer !== undefined) {
            this.subdivisionResultConsumer(newJsxCurve)
        }
        return newJsxCurve
    }

    elevate() {
        const elevated = this.pointControlledCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map((point, i) => this.createJSXGraphPoint(point.X(), point.Y(), PointStyles.pi(i)))
        this.pointControlledCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: BezierCurve = this.pointControlledCurve.extrapolate(t)
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    override deselect() {
        if (this.subdivisionPoint) {
            this.board.removeObject(this.subdivisionPoint)
        }
        if (this.extrapolationPoint) {
            this.board.removeObject(this.extrapolationPoint)
        }
        super.deselect();
        this.subdivisionPoint = null
        this.extrapolationPoint = null
    }

    showJxgPointss(show: boolean) {
        this.board.suspendUpdate()
        if (show) {
            this.showJxgPoints()
        } else {
            this.hideJxgPoints()
        }
        this.board.unsuspendUpdate()
    }

    setSubdivisionT(t: number) {
        this.subdivisionT = t
        this.board.update()
    }

    setExtrapolationT(t: number) {
        this.extrapolationT = t
        this.board.update()
    }

    getExtrapolationT() {
        return this.extrapolationT
    }

    createSubdivisionPoint() {
        if (this.board && !this.subdivisionPoint && this) {
            this.subdivisionPoint = this.board.create('point', [() => this.getCurve().calculatePointAtT(this.subdivisionT).X(),
                () => this.getCurve().calculatePointAtT(this.subdivisionT).Y()], PointStyles.default) as JXG.Point;
            this.subdivisionPoint.hide()
        }
    }

    createExtrapolationPoint() {
        if (this.board && !this.extrapolationPoint && this) {
            this.extrapolationPoint = this.board.create('point', [() => this.getCurve().calculatePointAtT(this.extrapolationT).X(),
                () => this.getCurve().calculatePointAtT(this.extrapolationT).Y()], PointStyles.default) as JXG.Point;
            this.extrapolationPoint.hide()
        }
    }

    showCurrentDecasteljauScheme(show?: boolean) {
        // TODO.... just look at it...
        if (show === undefined || show) {
            this.board.suspendUpdate()
            this.showDecasteljauScheme()
            this.board.unsuspendUpdate()
        }
    }

    showCutPoint() {
        this.setIntervalEnd(() => this.subdivisionT)
        this.subdivisionPoint?.show()
    }

    hideCutPoint() {
        this.setIntervalEnd(1)
        this.subdivisionPoint?.hide()
    }

    showSubdivisionPoint() {
        this.subdivisionPoint?.show()
    }

    hideSubdivisionPoint() {
        this.subdivisionPoint?.hide()
    }

    showExtrapolationPoint() {
        this.setIntervalEnd(() => this.extrapolationT)
        this.extrapolationPoint?.show()
    }

    hideExtrapolationPoint() {
        console.log(this.extrapolationPoint)
        console.log("hiding")
        this.setIntervalEnd(1)
        this.extrapolationPoint?.hide()
    }

    setDecasteljauT(t: number) {
        this.decasteljauT = t;
        this.showCurrentDecasteljauScheme()
    }

    getDecasteljauT() {
        return this.decasteljauT
    }

    getSubdivisionT() {
        return this.subdivisionT
    }

    getStartingCurve(points: number[][]): BezierCurve {
        let jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i)))
        return new BezierCurveImpl(jsxPoints);
    }
}
