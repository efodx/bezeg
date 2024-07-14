import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";

class Graph extends BaseSplineCurveGraph {

    override presets(): string {
        return "c0-spline"
    }

    defaultPreset(): string {
        return '["JSXSplineCurve|{\\"points\\":[[-3,2],[-4,-1],[-3,-2],[-1,1],[1,2],[4,2],[3,-1]],\\"degree\\":3,\\"continuity\\":0}"]';
    }
}

export default Graph;
