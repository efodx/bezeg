import '../../App.css';
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        let weights = [1, 2, 1, 1]
        this.createRationalJSXBezierCurve(points, weights)
    }

    override getInitialState(): BaseRationalBezierCurveGraphState {
        return {
            ...super.getInitialState(),
            currentWeight: 2
        }

    }

}

export default RationalBezierCurveGraph;
