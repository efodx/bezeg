import BaseCurveGraph, {BaseGraphStates} from "../base/BaseCurveGraph";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";

export abstract class BaseSplineCurveGraph extends BaseCurveGraph<any, BaseGraphStates> {
    override getFirstCurve(): BezierSpline {
        return super.getFirstCurve() as BezierSpline
    }

}