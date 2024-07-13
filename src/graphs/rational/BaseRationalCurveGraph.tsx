import BaseCurveGraph, {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";
import {RationalBezierCurve} from "../../bezeg/impl/curve/rational-bezier-curve";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";

interface BaseRationalBezierCurveGraphProps extends BaseGraphProps {

}

interface BaseRationalBezierCurveGraphState extends BaseGraphStates {
    currentWeight: number
}

export abstract class BaseRationalCurveGraph<P extends BaseRationalBezierCurveGraphProps, S extends BaseRationalBezierCurveGraphState> extends BaseCurveGraph<RationalBezierCurve, JSXRationalBezierCurve, P, S> {

    newJSXBezierCurve(points: number[][]): JSXRationalBezierCurve {
        const crv = new JSXRationalBezierCurve(points, [], this.board);
        crv.setSubdivisionResultConsumer((jsxCrv) => this.jsxBezierCurves.push(jsxCrv))
        return crv
    }

    createRationalJSXBezierCurve(points: number[][], weights: number[]): JSXRationalBezierCurve {
        let curve = super.createJSXBezierCurve(points);
        curve.getCurve().setWeights(weights)
        return curve
    }
}

export type {BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState}