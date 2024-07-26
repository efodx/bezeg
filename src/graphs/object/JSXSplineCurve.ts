/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {AbstractJSXPointControlledCurve, PointControlledCurveState} from "./AbstractJSXPointControlledCurve";
import {BezierSpline, Continuity} from "../../bezeg/impl/curve/bezier-spline";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";

interface JSXSplineConstructorParams {
    points: number[][],
    continuity: Continuity,
    degree: number,
    state: PointControlledCurveState
}

export class JSXSplineCurve extends AbstractJSXPointControlledCurve<BezierSpline, any> {
    nonFreeJsxPoints!: JXG.Point[];

    constructor(points: number[][], continuity: Continuity, degree: number, board: Board) {
        super(points, board)
        this.pointControlledCurve.setContinuity(continuity)
        this.pointControlledCurve.setDegree(degree)
        this.pointControlledCurve.generateBezierCurves()
        this.labelJxgPoints()
    }

    static toDto(curve: JSXSplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            degree: curve.pointControlledCurve.getDegree(),
            continuity: curve.pointControlledCurve.getContinuity(),
            state: curve.exportState()
        }
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JSXSplineCurve {
        const curve = new JSXSplineCurve(params.points, params.continuity, params.degree, board)
        if (params.state) {
            curve.importState(params.state)
        }
        return curve
    }

    override addPoint(x: number, y: number) {
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length))
        this.pointControlledCurve.addPoint(p)
        this.pointControlledCurve.generateBezierCurves()
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const len = this.nonFreeJsxPoints.length
            const jsxpoint = this.createJSXGraphPoint(() => this.getCurve().getNonFreePoints()[len].X(), () => this.getCurve().getNonFreePoints()[len].Y(), PointStyles.fixed)
            this.nonFreeJsxPoints.push(jsxpoint.point)
        }
        this.labelJxgPoints()
    }

    override removePoint(i: number) {
        const pointToRemove = this.getJxgPoints()[i]
        this.board.removeObject(pointToRemove)
        this.pointControlledCurve.removePoint(this.pointControlledCurve.getAllCurvePoints()[i])
        this.jxgPoints = this.jxgPoints.filter(point => point !== pointToRemove)
        this.pointControlledCurve.generateBezierCurves()
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const removed = this.nonFreeJsxPoints.pop()
            this.jxgPoints = this.jxgPoints.filter(el => el !== removed)
            this.board.removeObject(removed!)
        }
        this.labelJxgPoints()
    }

    getAllFreeJxgPoints() {
        return super.getJxgPoints().filter(point => !this.nonFreeJsxPoints.includes(point))
    }

    getAllNonFreeJxgPoints() {
        return super.getJxgPoints().filter(point => this.nonFreeJsxPoints.includes(point))
    }

    override getJxgPoints() {
        // We order them so that labeling of points gets done correctly!
        if (this.nonFreeJsxPoints === undefined) {
            this.generateNonFreeJsxGraphPoints(this.getCurve())
        }
        const freePoints: JXG.Point[] = this.getAllFreeJxgPoints()
        const nonFreePoints: JXG.Point[] = this.getAllNonFreeJxgPoints()
        return this.getCurve().getAllCurvePoints().map(point => point.isXFunction() || point.isYFunction())
            .map(fixed => {
                if (fixed) {
                    return nonFreePoints.shift()!
                } else {
                    return freePoints.shift()!
                }
            })
    }


    protected getStartingCurve(points: number[][]): BezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i)))
        return new BezierSpline(jsxPoints, 3, 1);
    }

    protected generateNonFreeJsxGraphPoints(spline: BezierSpline) {
        // This may look dumb, but in reality this makes us able to change underlying non-free points
        this.nonFreeJsxPoints = spline.getNonFreePoints()
            .map((p, i) => this.createJSXGraphPoint(() => spline.getNonFreePoints()[i].X(), () => spline.getNonFreePoints()[i].Y(), PointStyles.fixed))
            .map(point => point.point)
    }

}
