import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";

class Graph extends BaseSplineCurveGraph {
    initialize() {
        let points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]]
        this.createJSXSplineCurve(points, 3, 1)
    }

}

export default Graph;
