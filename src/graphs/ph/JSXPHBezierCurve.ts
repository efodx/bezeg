/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve} from "../bezier/JSXBezierCurve";
import {PhBezierCurve} from "../../bezeg/ph-bezier-curve";
import {PointImpl} from "../../bezeg/point/point-impl";
import {PointStyles} from "../styles/PointStyles";

export class JSXPHBezierCurve extends JSXBezierCurve {

    override getStartingCurve(points: number[][]): PhBezierCurve {
        let pointsImpl = points.map(p => new PointImpl(p[0], p[1]))
        let curve = new PhBezierCurve(pointsImpl.slice(0, 1), pointsImpl.slice(1));
        curve.getPoints().map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.pi(i)))
        return curve
    }
}
