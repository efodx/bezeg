import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override presets(): string {
        return "c2-spline";
    }

    defaultPreset(): any {
        return [["JSXQubicC2SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]],
            "degree": 3,
            "continuity": 3,
            "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }


}

export default Graph;
