import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";

class BezierCurveGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }
}

export default BezierCurveGraph;
