import BaseGraph from "./BaseGraph";
import {BezierCurve} from "../bezeg/bezier-curve";
import {JSXBezierCurve} from "./JSXBezierCurve";

export abstract class BaseCurveGraph extends BaseGraph<BezierCurve, JSXBezierCurve> {
    newJSXBezierCurve(points: number[][]): JSXBezierCurve {
        return new JSXBezierCurve(points, this.board);
    }

}