import BaseCurveGraph, {BaseGraphStates} from "../base/BaseCurveGraph";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";
import {JSXSplineCurve} from "../object/JSXSplineCurve";

export abstract class BaseSplineCurveGraph<S extends BaseGraphStates> extends BaseCurveGraph<any, S> {
    override getFirstCurve(): BezierSpline {
        return super.getFirstCurve() as BezierSpline;
    }

    override getFirstJsxCurve(): JSXSplineCurve<any> {
        return super.getFirstJsxCurve() as JSXSplineCurve<any>;
    }

}