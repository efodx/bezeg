import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";

class BezierCurveGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {

    defaultPreset() {
        return "[\"JSXBezierCurve|{\\\"points\\\":[[-4,-3],[-3,2],[2,2],[3,-2]]}\"]"
    }

    override presets() {
        return "bezier-curve"
    }
}

export default BezierCurveGraph;
