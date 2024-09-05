import BaseCurveGraph, {BaseGraphStates} from "./BaseCurveGraph";
import {JXGBezierCurve} from "../object/JXGBezierCurve";


export abstract class BaseBezierCurveGraph<P, S extends BaseGraphStates> extends BaseCurveGraph<P, S> {
    override getFirstJxgCurve() {
        return super.getFirstJxgCurve() as JXGBezierCurve;
    }

    override getSelectedCurve() {
        return super.getSelectedCurve() as JXGBezierCurve;
    }
}
