import BaseGraph from "./BaseGraph";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";
import {JSXRationalBezierCurve} from "./JSXRationalBezierCurve";

export abstract class BaseRationalCurveGraph extends BaseGraph<RationalBezierCurve, JSXRationalBezierCurve> {

    newJSXBezierCurve(points: number[][]): JSXRationalBezierCurve {
        return new JSXRationalBezierCurve(points, [], this.board);
    }

    createRationalJSXBezierCurve(points: number[][], weights: number[]): JSXRationalBezierCurve {
        let curve = super.createJSXBezierCurve(points);
        curve.getBezierCurve().setWeights(weights)
        return curve
    }

}