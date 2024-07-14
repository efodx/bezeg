import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";

class RationalBezierCurveGraph extends BaseRationalCurveGraph<any, BaseGraphStates> {

    override initialize() {
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

    defaultPreset(): string {
        return "";
    }

}

export default RationalBezierCurveGraph;
