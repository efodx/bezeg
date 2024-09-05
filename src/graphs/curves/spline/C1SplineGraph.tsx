import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";

class C1SplineGraph extends BaseSplineCurveGraph<BaseGraphStates> {

    defaultPreset(): any {
        return [["JSXQuadraticC1SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [2, 1]], "degree": 2, "continuity": 1, "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "c1-spline-graph";
    }
}

export default C1SplineGraph;
