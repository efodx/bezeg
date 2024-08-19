import {AbstractJSXPointControlledCurve, PointControlledCurveAttributes} from "./AbstractJSXPointControlledCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";
import {PointStyles} from "../styles/PointStyles";
import {Color, Colors} from "../bezier/utilities/Colors";
import {SegmentStyles} from "../styles/SegmentStyles";
import {CacheContext} from "../context/CacheContext";
import {Point} from "../../bezeg/api/point/point";
import {JSXBezierCurveState} from "./JSXBezierCurve";

export interface BezierCurveAttributes extends PointControlledCurveAttributes {
    allowSubdivision: boolean,
    allowExtrapolation: boolean,
    allowElevation: boolean
    allowDecasteljau: boolean,
    allowShrink: boolean
}

export abstract class AbstractJSXBezierCurve<T extends BezierCurve, Attr extends BezierCurveAttributes> extends AbstractJSXPointControlledCurve<T, Attr> {
    subdivisionT: number = 0.5;
    extrapolationT: number = 1.2;
    subdivisionPoint: JXG.Point | null = null;
    extrapolationPoint: JXG.Point | null = null;
    decasteljauPoints: JXG.Point[] = []
    cachedDecasteljauScheme: Point[][] = [];
    cacheContext: number = -1;
    lastDecasteljauN: number = -1;
    showingDecasteljauScheme: boolean = false;
    showingDecasteljauPoints: boolean = false
    protected subdivisionResultConsumer?: (curve: this) => void
    private decasteljauT: number = 0.5;
    private decasteljauSegments: JXG.Segment[] = []
    private elevationPoints: JXG.Point[] = [];

    /**
     * Subdivides the curve at t.
     * This JSXBezierCurve becomes the part that was at [0,t] while the method returns the part from [t,1]
     * @param t
     */
    abstract subdivide(t: number): this

    abstract extrapolate(t: number): void

    abstract elevate(t: number): void

    setSubdivisionResultConsumer(consumer: ((curve: this) => void)) {
        this.subdivisionResultConsumer = consumer
    }

    override addPoint(x: number, y: number) {
        super.addPoint(x, y);
        if (this.decasteljauSegments.length !== 0) {
            this.generateLineSegments()
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    override removePoint(i: number) {
        super.removePoint(i);
        if (this.decasteljauSegments.length !== 0) {
            this.generateLineSegments()
        }
        if (!this.showingDecasteljauScheme) {
            this.hideDecasteljauScheme()
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    showCurrentDecasteljauScheme(show?: boolean) {
        // TODO.... just look at it...
        if (show === undefined || show) {
            this.showDecasteljauScheme()
        }
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
        if ((this.getCurve().getPoints().length > 1) && this.lastDecasteljauN !== this.pointControlledCurve.getPoints().length) {
            this.lastDecasteljauN = this.pointControlledCurve.getPoints().length
            this.generateLineSegments()
        } else {
            // @ts-ignore
            this.decasteljauPoints.concat(this.decasteljauSegments).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
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

    showElevatePoints() {
        const elevated = this.pointControlledCurve.elevate()
        this.elevationPoints = elevated.getPoints().map(point => this.board.create('point', [() => point.X(),
            () => point.Y()], {...PointStyles.default, color: Color.LIGHT_GREEN}) as JXG.Point)
    }

    hideElevatePoints() {
        this.board.removeObject(this.elevationPoints)
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
                        color: Colors[r],
                        name: () => this.showingDecasteljauPoints ? `$$p_${i}^${r}$$` : ""
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(this.decasteljauT)[r][i].X(),
                    () => this.getDecasteljauScheme(this.decasteljauT)[r][i].Y()], {
                    ...PointStyles.default,
                    color: Colors[r],
                    name: () => this.showingDecasteljauPoints ? `$$p_${i}^${r}$$` : ""
                });
                const segment = this.board!.create('segment', [pp1, pp2], SegmentStyles.default);
                this.decasteljauSegments.push(segment)
                // @ts-ignore
                this.decasteljauPoints.push(pp1)
                // @ts-ignore
                this.decasteljauPoints.push(pp2)
            }
        }
        console.log("DRAWING POINT BBY")
        const drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(this.decasteljauT)[n - 1][0].X(), () => this.getDecasteljauScheme(this.decasteljauT)[n - 1][0].Y()], {
            ...PointStyles.default,
            color: Colors[n - 1],
            name: () => this.showingDecasteljauPoints ? `$$p_${0}^${n}$$` : ""
        });

        if (drawingPoint instanceof JXG.Point) {
            this.decasteljauPoints.push(drawingPoint)
        }
        this.jxgPoints.forEach((point, i) => point.setAttribute({name: () => this.showingDecasteljauPoints ? `$$p_${i}^0$$` : `$$p_${i}$$`}))

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

    showDecasteljauPoints() {
        this.showingDecasteljauPoints = true
    }

    hideDecasteljauPoints() {
        this.showingDecasteljauPoints = false
    }

    isShowingDecasteljauPoints() {
        return this.showingDecasteljauPoints
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
        this.setIntervalEnd(1)
        this.extrapolationPoint?.hide()
    }

    setDecasteljauT(t: number) {
        this.decasteljauT = t;
        if (this.showingDecasteljauScheme) {
            this.showCurrentDecasteljauScheme()
        }
    }

    getDecasteljauT() {
        return this.decasteljauT
    }

    getSubdivisionT() {
        return this.subdivisionT
    }

}