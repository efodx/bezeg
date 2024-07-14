import BaseCurveGraph, {BaseGraphStates} from "./BaseCurveGraph";
import {JSXBezierCurve} from "../object/JSXBezierCurve";


export abstract class BaseBezierCurveGraph<P, S extends BaseGraphStates> extends BaseCurveGraph<P, S> {
    override getFirstJsxCurve() {
        return super.getFirstJsxCurve() as JSXBezierCurve
    }

    override getSelectedCurve() {
        return super.getSelectedCurve() as JSXBezierCurve
    }
}
