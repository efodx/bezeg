import {PointControlledCurve} from "./point-controlled-curve";
import {Point} from "./point/point";
import {BezierCurve} from "./bezier-curve";
import {PointImpl} from "./point/point-impl";

/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 * There are just certain restrictions.
 */
export class PhBezierCurve extends PointControlledCurve {
    private bezierCurve: BezierCurve
    private degree: number

    constructor(points: Array<Point>, degree: number) {
        super(points);
        this.degree = degree
        this.bezierCurve = new BezierCurve(this.generatePointsForUnderlyingBezierCurve(points, degree))
    }

    calculatePointAtT(t: number): Point {
        return this.bezierCurve.calculatePointAtT(t)
    }


    private generatePointsForUnderlyingBezierCurve(points: Array<Point>, degree: number) {
        const p0 = points[0]
        const w0 = points[1]
        const w1 = points[2]

        const bp0 = p0
        const bp1 = new PointImpl(() => bp0.X() + 1 / 3 * (w0.X() ** 2 - w0.Y() ** 2),
            () => bp0.Y() + 2 / 3 * w0.X() * w0.Y())
        const bp2 = new PointImpl(() => bp1.X() + 1 / 3 * (w0.X() * w1.X() - w0.Y() * w1.Y()),
            () => bp1.Y() + 1 / 3 * (w0.X() * w1.Y() + w0.Y() * w1.X()))
        const bp3 = new PointImpl(() => bp2.X() + 1 / 3 * (w1.X() ** 2 - w1.Y() ** 2),
            () => bp2.Y() + 2 / 3 * w1.X() * w1.Y())

        return [bp0, bp1, bp2, bp3]
    }
}