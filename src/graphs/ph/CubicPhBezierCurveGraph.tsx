import '../../App.css';
import BasePhBezierCurveGraph from "./BasePhBezierCurveGraph";

class CubicPhBezierCurveGraph extends BasePhBezierCurveGraph {

    getStartingHodographs(): number[][] {
        return [[-3, 2], [2, 2]];
    }

    getStartingPoints(): number[][] {
        return [[0, 0]];
    }
}

export default CubicPhBezierCurveGraph;
