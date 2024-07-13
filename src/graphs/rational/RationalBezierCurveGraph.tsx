import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        let weights = [1, 2, 1, 1]
        this.createRationalJSXBezierCurve(points, weights)
    }

}


export default RationalBezierCurveGraph;
