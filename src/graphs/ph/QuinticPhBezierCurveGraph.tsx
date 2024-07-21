import '../../App.css';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";

class QuinticPhBezierCurve extends BasePhBezierCurveGraph<any, BasePhBezierCurveGraphStates> {

    defaultPreset(): any {
        return [["JSXPHBezierCurve", {
            "points": [[0, 0]], "hodographs": [[-3, 2], [2, 2], [1, 2]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2,
                "showOffsetCurveControlPoints": false,
                "showOffsetCurve": false
            }
        }]];
    }

    override presets(): string {
        return "quintic-ph-graph"
    }

}

export default QuinticPhBezierCurve;
