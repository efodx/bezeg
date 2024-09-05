import {BezierCurveAttributes} from "../object/AbstractJXGBezierCurve";
import {PointControlledCurveAttributes} from "../object/AbstractJXGPointControlledCurve";

export const Attributes = {
    bezierDisabled: {
        allowSubdivision: false,
        allowDecasteljau: false,
        allowElevation: false,
        allowExtrapolation: false,
        allowShrink: false,
    } as BezierCurveAttributes,
    pointControlledDisabled: {
        allowShowPoints: true,
        allowShowControlPolygon: false,
        allowShowConvexHull: false
    } as PointControlledCurveAttributes
};