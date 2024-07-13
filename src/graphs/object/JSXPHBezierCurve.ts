/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve} from "./JSXBezierCurve";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import {PointImpl} from "../../bezeg/impl/point/point-impl";
import {PointStyles} from "../styles/PointStyles";

export class JSXPHBezierCurve extends JSXBezierCurve {

    override getStartingCurve(points: number[][]): PhBezierCurve {
        const pointsImpl = points.map(p => new PointImpl(p[0], p[1]))
        const curve = new PhBezierCurve(pointsImpl.slice(0, 1), pointsImpl.slice(1));
        curve.getPoints().map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.pi(i)))
        return curve
    }
}
