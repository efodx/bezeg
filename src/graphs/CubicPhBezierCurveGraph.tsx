import '../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";

class CubicPhBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2]]
        this.createJSXBezierCurve(points)
    }

    override newJSXBezierCurve(points: number[][]): JSXPHBezierCurve {
        return new JSXPHBezierCurve(points, this.board);
    }
}

export default CubicPhBezierCurveGraph;
