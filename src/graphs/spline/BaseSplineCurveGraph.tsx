import BaseCurveGraph, {BaseGraphStates} from "../base/BaseCurveGraph";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";

export abstract class BaseSplineCurveGraph<S extends BaseGraphStates> extends BaseCurveGraph<any, S> {
    override getFirstCurve(): BezierSpline {
        return super.getFirstCurve() as BezierSpline
    }

}