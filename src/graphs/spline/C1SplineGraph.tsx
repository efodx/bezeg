import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Continuity} from "../../bezeg/bezier-spline";

class Graph extends BaseSplineCurveGraph {
    initialize() {
        let points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]]
        this.createJSXSplineCurve(points, 3, Continuity.C1)
    }

}

export default Graph;
