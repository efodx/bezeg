/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {AbstractJSXPointControlledCurve, PointControlledCurveState} from "./AbstractJSXPointControlledCurve";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";

export interface JSXSplineConstructorParams {
    points: number[][],
    state: PointControlledCurveState
}

export abstract class JSXSplineCurve<C extends BezierSpline> extends AbstractJSXPointControlledCurve<C, any> {
    nonFreeJsxPoints!: JXG.Point[];

    constructor(points: number[][], board: Board) {
        super(points, board);
        this.pointControlledCurve.generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }

    override addPoint(x: number, y: number) {
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length));
        this.pointControlledCurve.addPoint(p);
        this.pointControlledCurve.generateBezierCurves();
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const len = this.nonFreeJsxPoints.length;
            const jsxpoint = this.createJSXGraphPoint(() => this.getCurve().getNonFreePoints()[len].X(), () => this.getCurve().getNonFreePoints()[len].Y(), PointStyles.fixed);
            this.nonFreeJsxPoints.push(jsxpoint.point);
        }
        this.labelJxgPoints();
    }

    override removePoint(i: number) {
        const pointToRemove = this.getJxgPoints()[i];
        this.board.removeObject(pointToRemove);
        this.pointControlledCurve.removePoint(this.pointControlledCurve.getAllCurvePoints()[i]);
        this.jxgPoints = this.jxgPoints.filter(point => point !== pointToRemove);
        this.pointControlledCurve.generateBezierCurves();
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const removed = this.nonFreeJsxPoints.pop();
            this.jxgPoints = this.jxgPoints.filter(el => el !== removed);
            this.board.removeObject(removed!);
        }
        this.labelJxgPoints();
    }

    getAllFreeJxgPoints() {
        return super.getJxgPoints().filter(point => !this.nonFreeJsxPoints.includes(point));
    }

    getAllNonFreeJxgPoints() {
        return super.getJxgPoints().filter(point => this.nonFreeJsxPoints.includes(point));
    }

    protected refreshNonFreeJsxGraphPoints() {
        this.board.removeObject(this.nonFreeJsxPoints);
        const spline = this.getCurve();
        // This may look dumb, but in reality this makes us able to change underlying non-free points
        this.nonFreeJsxPoints = spline.getNonFreePoints()
            .map((p, i) => this.createJSXGraphPoint(() => spline.getNonFreePoints()[i].X(), () => spline.getNonFreePoints()[i].Y(), PointStyles.fixed))
            //  .map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.fixed))
            .map(point => point.point);
    }

}
