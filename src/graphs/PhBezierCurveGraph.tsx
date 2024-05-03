import '../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";

class PhBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2]]
        this.createJSXBezierCurve(points)
    }

    override newJSXBezierCurve(points: number[][]): JSXPHBezierCurve {
        // This is very hacky :/
        // We create the curve
        let phCurve = new JSXPHBezierCurve(points, this.board);
        // We create a point on graph that represents the non-free point of the PH curve

        // Then we fetch that same point and push it to the curve as it's own
        // This is so that showing control polygon uses the non-free point as well.
        //
        // I may get rid of ph-bezier-curve.ts, and force the fixed point calculations on JSXPHBezierCurve level.
        return phCurve
    }
}

export default PhBezierCurveGraph;
