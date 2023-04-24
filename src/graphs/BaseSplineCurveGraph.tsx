import BaseGraph from "./BaseGraph";
import {JSXSplineCurve} from "./JSXSplineCurve";
import {BezierSpline} from "../bezeg/bezier-spline";

export abstract class BaseSplineCurveGraph extends BaseGraph<BezierSpline, JSXSplineCurve> {
    newJSXBezierCurve(points: number[][]): JSXSplineCurve {
        return new JSXSplineCurve(points, 3, 1, this.board);
    }

    createJSXSplineCurve(points: number[][], degree: number, continuity: number): JSXSplineCurve {
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