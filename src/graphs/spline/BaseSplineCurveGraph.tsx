import BaseCurveGraph, {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";
import {JSXSplineCurve} from "./JSXSplineCurve";
import {BezierSpline, Continuity} from "../../bezeg/impl/curve/bezier-spline";

export abstract class BaseSplineCurveGraph extends BaseCurveGraph<BezierSpline, JSXSplineCurve, BaseGraphProps, BaseGraphStates> {
    newJSXBezierCurve(points: number[][]): JSXSplineCurve {
        return new JSXSplineCurve(points, Continuity.C1, 1, this.board);
    }

    createJSXSplineCurve(points: number[][], degree: number, continuity: Continuity): JSXSplineCurve {
        let curve = super.createJSXBezierCurve(points);
        let spline = curve.getCurve()
        spline.setDegree(degree)
        spline.setContinuity(continuity)
        spline.generateBezierCurves()
        curve.labelJxgPoints()
        return curve
    }
}