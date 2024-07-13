import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";

class BezierCurveGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        let points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        let presetContext = this.context
        // @ts-ignore
        const preset = this.presetService?.getPreset(presetContext.selected)
        if (preset) {
            points = this.importPreset(preset.data)
        }

        this.createJSXBezierCurve(points)
    }

    override presets() {
        return "bezier-curve"
    }

    override importPreset(presetString: string): number[][] {
        return JSON.parse(presetString)
    }

    override exportPreset() {
        return JSON.stringify(this.getFirstCurve().getPoints().map(point => [point.X(), point.Y()]))
    }
}

export default BezierCurveGraph;
