import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";

class C1SplineGraph extends BaseSplineCurveGraph {

    defaultPreset(): string {
        return '["JSXSplineCurve|{\\"points\\":[[-3,2],[-4,-1],[-3,-2],[-1,1],[1,2]],\\"degree\\":3,\\"continuity\\":1}"]';
    }

    override presets(): string {
        return "c1-spline-graph"
    }
}

export default C1SplineGraph;
