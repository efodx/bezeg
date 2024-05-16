/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve} from "../bezier/JSXBezierCurve";
import {PhBezierCurve} from "../../bezeg/ph-bezier-curve";
import {PointImpl} from "../../bezeg/point/point-impl";

export class JSXPHBezierCurve extends JSXBezierCurve {

    protected getStartingCurve(points: number[][]): PhBezierCurve {
        let p1 = points[0]
        let bp1 = this.createJSXGraphPoint(p1[0], p1[1])
        return new PhBezierCurve([bp1], points.slice(1).map(p => new PointImpl(p[0], p[1])));
    }
}
