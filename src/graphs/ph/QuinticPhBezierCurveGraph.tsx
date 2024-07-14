import '../../App.css';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";

class QuinticPhBezierCurve extends BasePhBezierCurveGraph<any, BasePhBezierCurveGraphStates> {

    defaultPreset(): string {
        return '["JSXPHBezierCurve|{\\"points\\":[[0,0]],\\"hodographs\\":[[-3,2],[2,2],[1,2]]}"]';
    }

    override presets(): string {
        return "quintic-ph-graph"
    }

}

export default QuinticPhBezierCurve;
