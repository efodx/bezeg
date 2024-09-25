import DecasteljauGraph from "../bezier/DecasteljauGraph";

class RationalDecasteljauGraph extends DecasteljauGraph {

    override defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-4, -3], [-3, 3], [3, 3], [4, -3]], "weights": [1, 2, 1, 1], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "subdivisionT": 0.5,
                "extrapolationT": 1.2,
                "showingWeights": false,
                "weightNumber": 1,
                "showingFarinPoints": false,
                "showingDecasteljauScheme": true
            }
        }]];
    }

    override presets(): string {
        return "rational-decasteljau";
    }

}

export default RationalDecasteljauGraph;
