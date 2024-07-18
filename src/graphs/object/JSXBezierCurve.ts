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
    private decasteljauScheme: Point[][] = [];
    private decasteljauSlider: JXG.Slider | null = null;
    private lastDecasteljauT: number | null = null;
    private showingDecasteljauScheme: boolean = false;
    private extrapolationT: number = 1.2;
    private subdivisionPoint: JXG.Point | null = null;
    private extrapolationPoint: JXG.Point | null = null;
    private cachedDecasteljauScheme: Point[][] = [];
    private cacheContext: number = -1;

    static toStr(curve: JSXBezierCurve): string {
        return JSON.stringify({
            points: curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        } as JSXBezierCurveConstructorParams, null, '\t')
    }

    static fromStr(str: string, board: Board): JSXBezierCurve {
        const params = JSON.parse(str) as JSXBezierCurveConstructorParams
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

    showDecasteljauSchemeForSlider(slider: JXG.Slider) {
        this.decasteljauSlider = slider;
        if ((this.decasteljauSegments.length === 0 && this.getCurve().getPoints().length > 2) || this.decasteljauScheme.length !== this.getCurve().getPoints().length) {
            this.generateLineSegments(slider)
        } else {
            // @ts-ignore
            this.decasteljauSegments.concat(this.decasteljauPoints).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
    }

    showDecasteljauSchemeForT(t: number) {
        this.lastDecasteljauT = t
        if ((this.getCurve().getPoints().length > 2) || this.decasteljauScheme.length !== this.getCurve().getPoints().length) {
            this.generateLineSegmentsForT(t)
        } else {
            // @ts-ignore
            this.decasteljauSegments.concat(this.decasteljauPoints).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
    }

    generateLineSegmentsForT(t: number) {
        this.decasteljauScheme = this.pointControlledCurve.decasteljauScheme(t)
        // @ts-ignore
        this.board.removeObject(this.decasteljauPoints.concat(this.decasteljauSegments))
        this.decasteljauSegments = []
        this.decasteljauPoints = []
        const n = this.decasteljauScheme.length
        this.showControlPolygonInternal()
        for (let r = 1; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                let pp1 = null;
                let pp2 = null;
                if (i === 1) {
                    // @ts-ignore
                    pp1 = this.board.create('point', [() => this.getDecasteljauScheme(t)[r][i - 1].X(),
                        () => this.getDecasteljauScheme(t)[r][i - 1].Y()], {
                        ...PointStyles.default,
                        color: Colors[r]
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(t)[r][i].X(),
                    () => this.getDecasteljauScheme(t)[r][i].Y()], {
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
        const drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(t)[n - 1][0].X(), () => this.getDecasteljauScheme(t)[n - 1][0].Y()], {
            ...PointStyles.default,
            color: Colors[n - 1]
        });

        if (drawingPoint instanceof JXG.Point) {
            this.decasteljauPoints.push(drawingPoint)
        }

    }

    generateLineSegments(slider: JXG.Slider) {
        // @ts-ignore
        this.board.removeObject(this.decasteljauPoints.concat(this.decasteljauSegments))
        this.decasteljauSegments = []
        this.decasteljauPoints = []
        const n = this.getCurve().getPoints().length
        this.showControlPolygonInternal()
        for (let r = 1; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                let pp1 = null;
                let pp2 = null;
                if (i === 1) {
                    // @ts-ignore
                    pp1 = this.board.create('point', [() => this.getDecasteljauScheme(slider.Value())[r][i - 1].X(),
                        () => this.getDecasteljauScheme(slider.Value())[r][i - 1].Y()], {
                        ...PointStyles.default,
                        color: Colors[r],
                        name: "$$p_" + (i - 1) + "^" + r + "$$",
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(slider.Value())[r][i].X(),
                    () => this.getDecasteljauScheme(slider.Value())[r][i].Y()], {
                    ...PointStyles.default,
                    // @ts-ignore
                    color: Colors[r],
                    name: "$$p_" + i + "^" + r + "$$",
                });
                const segment = this.board!.create('segment', [pp1, pp2], SegmentStyles.default);
                this.decasteljauSegments.push(segment)
                // @ts-ignore
                this.decasteljauPoints.push(pp1)
                // @ts-ignore
                this.decasteljauPoints.push(pp2)
            }
        }
        let drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(slider.Value())[n - 1][0].X(), () => this.getDecasteljauScheme(slider.Value())[n - 1][0].Y()], {
            ...PointStyles.default,
            color: Colors[n - 1],
            trace: false,
            name: "$$p_" + 0 + "^" + (n - 1) + "$$",
        });
        this.decasteljauPoints.push(drawingPoint)
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
        if (this.decasteljauSlider != null) {
            this.generateLineSegments(this.decasteljauSlider)
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    override removePoint(i: number) {
        super.removePoint(i);
        if (this.decasteljauSlider != null) {
            this.generateLineSegments(this.decasteljauSlider)
        } else if (this.lastDecasteljauT != null) {
            this.generateLineSegmentsForT(this.lastDecasteljauT)
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

    override select() {
        if (this.subdivisionPoint) {
            // @ts-ignore
            this.board.removeObject(this.subdivisionPoint)
        }
        if (this.extrapolationPoint) {
            this.board.removeObject(this.extrapolationPoint)
        }
        super.select();
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
            this.showDecasteljauSchemeForT(this.decasteljauT)
            this.board.unsuspendUpdate()
        }
    }

    hideSelectedCurveDecasteljauScheme() {
        this.board.suspendUpdate()
        this.hideDecasteljauScheme()
        this.board.unsuspendUpdate()
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
