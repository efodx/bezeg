import BaseCurveGraph, {BaseGraphProps, BaseGraphStates} from "./BaseCurveGraph";
import {JSXBezierCurve} from "../object/JSXBezierCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";


interface BaseCurveGraphProps extends BaseGraphProps {
    allowSelectedCurveSubdivision: boolean,
    allowSelectedCurveExtrapolation: boolean,
    allowSelectedCurveDecasteljau: boolean,
    allowSelectedCurveElevation: boolean,
    allowSelectedCurveShrink: boolean,
    allowSelectedCurveShowPoints: boolean
}

export abstract class BaseBezierCurveGraph<P extends BaseCurveGraphProps, S extends BaseGraphStates> extends BaseCurveGraph<BezierCurve, JSXBezierCurve, P, S> {

    newJSXBezierCurve(points: number[][]): JSXBezierCurve {
        const curve = new JSXBezierCurve(points, this.board);
        curve.setSubdivisionResultConsumer((jsxCrv) => this.jsxBezierCurves.push(jsxCrv))
        return curve
    }

}

export type {BaseCurveGraphProps}