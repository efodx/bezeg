/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {AbstractJSXPointControlledCurve} from "./AbstractJSXPointControlledCurve";
import {BezierSpline, Continuity} from "../bezeg/bezier-spline";
import {Board} from "jsxgraph";

export class JSXSplineCurve extends AbstractJSXPointControlledCurve<BezierSpline> {

    constructor(points: number[][], continuity: Continuity, degree: number, board: Board) {
        super(points, board)
        this.pointControlledCurve.setContinuity(continuity)
        this.pointControlledCurve.setDegree(degree)
        this.pointControlledCurve.generateBezierCurves()
    }

    protected getStartingCurve(points: number[][]): BezierSpline {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new BezierSpline(jsxPoints, 3, 1);
    }
}
