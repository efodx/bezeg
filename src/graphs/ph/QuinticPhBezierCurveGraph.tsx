import '../../App.css';
import BasePhBezierCurveGraph from "./BasePhBezierCurveGraph";

class QuinticPhBezierCurve extends BasePhBezierCurveGraph {
    getStartingHodographs(): number[][] {
        return [[-3, 2], [2, 2], [1, 3]];
    }

    getStartingPoints(): number[][] {
        return [[0, 0]];
    }

}

export default QuinticPhBezierCurve;
