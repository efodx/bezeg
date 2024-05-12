import BaseGraph, {BaseGraphProps, BaseGraphStates} from "../base/BaseGraph";
import {JSXSplineCurve} from "./JSXSplineCurve";
import {BezierSpline, Continuity} from "../../bezeg/bezier-spline";

export abstract class BaseSplineCurveGraph extends BaseGraph<BezierSpline, JSXSplineCurve, BaseGraphProps, BaseGraphStates> {
    newJSXBezierCurve(points: number[][]): JSXSplineCurve {
        return new JSXSplineCurve(points, Continuity.C1, 1, this.board);
    }

    createJSXSplineCurve(points: number[][], degree: number, continuity: Continuity): JSXSplineCurve {
        let curve = super.createJSXBezierCurve(points);
        let spline = curve.getCurve()
        spline.setDegree(degree)
        spline.setContinuity(continuity)
        spline.generateBezierCurves()
        // This may look dumb, but in reality this makes us able to change underlying non-free points
        spline.getNonFreePoints().map((p, i) => this.createJSXGraphPoint(() => spline.getNonFreePoints()[i].X(), () => spline.getNonFreePoints()[i].Y(), {
            fixed: true,
            color: "blue"
        }))
        return curve
    }
}