import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override presets(): string {
        return "c2-spline";
    }

    defaultPreset(): any {
        return [["JSXQubicC2SplineCurve", {
            "points": [[-2.7, 1.8], [-4.7, 0.35], [-4.3, -3], [1, -2, 5], [0.2, 1.8], [4, 1], [4.5, -2.3]],
            "degree": 3,
            "continuity": 3,
            "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }


}

export default Graph;
