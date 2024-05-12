import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";

class BezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }
}

export default BezierCurveGraph;
