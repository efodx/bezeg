import '../../App.css';
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {

    initialize() {
        let points = [[0, 3], [3, 3], [3, 0]]
        let weights = [1, Math.sqrt(2) / 2, 1]
        this.createRationalJSXBezierCurve(points, weights)

        let points2 = [[3, 0], [3, -3], [0, -3]]
        let weights2 = [1, Math.sqrt(2) / 2, 1]
        this.createRationalJSXBezierCurve(points2, weights2)

        let points3 = [[0, -3], [-3, -3], [-3, 0]]
        let weights3 = [1, Math.sqrt(2) / 2, 1]
        this.createRationalJSXBezierCurve(points3, weights3)

        let points4 = [[-3, 0], [-3, 3], [0, 3]]
        let weights4 = [1, Math.sqrt(2) / 2, 1]
        this.createRationalJSXBezierCurve(points4, weights4)
    }

    override getInitialState(): BaseRationalBezierCurveGraphState {
        return {
            ...super.getInitialState(),
            currentWeight: 0.5
        }

    }

}

export default RationalBezierCurveGraph;
