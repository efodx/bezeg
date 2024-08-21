import BaseCurveGraph, {BaseGraphStates} from "../base/BaseCurveGraph";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";

export abstract class BaseRationalCurveGraph<P, S extends BaseGraphStates> extends BaseCurveGraph<P, S> {
    override initialize() {
        super.initialize();
        this.boardUpdate();
    }

    override getFirstJsxCurve(): JSXRationalBezierCurve {
        return super.getFirstJsxCurve() as JSXRationalBezierCurve;
    }
}
