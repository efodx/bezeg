import '../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";

class BezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }
}

export default BezierCurveGraph;
