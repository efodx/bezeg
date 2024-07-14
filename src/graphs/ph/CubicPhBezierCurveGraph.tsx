import '../../App.css';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";
import {BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";

class CubicPhBezierCurveGraph extends BasePhBezierCurveGraph<BaseCurveGraphProps, BasePhBezierCurveGraphStates> {
    defaultPreset(): string {
        return '["JSXPHBezierCurve|{\\"points\\":[[0,0]],\\"hodographs\\":[[-3,2],[2,2]]}"]'
    }

    override presets(): string | undefined {
        return "cubic-ph"
    }

}

export default CubicPhBezierCurveGraph;
