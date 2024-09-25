import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";

class QuinticPhBezierCurve extends BasePhBezierCurveGraph<any, BasePhBezierCurveGraphStates> {

    defaultPreset(): any {
        return [["JSXPHBezierCurve", {
            "points": [[1, -1]], "hodographs": [[-3.3, 0], [0.2, -4], [2, -3.2]], "state": {
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
        return "quintic-ph-graph";
    }

}

export default QuinticPhBezierCurve;
