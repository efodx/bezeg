import {JXGRationalBezierCurve} from "../object/./JXGRationalBezierCurve";
import BaseCurveGraph, {BaseGraphStates} from "../../base/BaseCurveGraph";

export abstract class BaseRationalCurveGraph<P, S extends BaseGraphStates> extends BaseCurveGraph<P, S> {
    override initialize() {
        super.initialize();
        this.boardUpdate();
    }

    override getFirstJxgCurve(): JXGRationalBezierCurve {
        return super.getFirstJxgCurve() as JXGRationalBezierCurve;
    }
}
