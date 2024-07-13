import BaseCurveGraph, {BaseGraphProps, BaseGraphStates} from "./BaseCurveGraph";
import {JSXBezierCurve} from "../object/JSXBezierCurve";


interface BaseCurveGraphProps extends BaseGraphProps {
    allowSelectedCurveSubdivision: boolean,
    allowSelectedCurveExtrapolation: boolean,
    allowSelectedCurveDecasteljau: boolean,
    allowSelectedCurveElevation: boolean,
    allowSelectedCurveShrink: boolean,
    allowSelectedCurveShowPoints: boolean
}

export abstract class BaseBezierCurveGraph<P extends BaseCurveGraphProps, S extends BaseGraphStates> extends BaseCurveGraph<P, S> {
    override getFirstJsxCurve() {
        return super.getFirstJsxCurve() as JSXBezierCurve
    }

    override getSelectedCurve() {
        return super.getSelectedCurve() as JSXBezierCurve
    }
}

export type {BaseCurveGraphProps}