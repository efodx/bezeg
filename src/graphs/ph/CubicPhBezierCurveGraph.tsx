import '../../App.css';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";

class CubicPhBezierCurveGraph extends BasePhBezierCurveGraph<any, BasePhBezierCurveGraphStates> {
    defaultPreset(): string {
        return '["JSXPHBezierCurve|{\\"points\\":[[0,0]],\\"hodographs\\":[[-3,2],[2,2]]}"]'
    }

    override presets(): string | undefined {
        return "cubic-ph"
    }

}

export default CubicPhBezierCurveGraph;
