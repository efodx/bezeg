import {BezierCurve} from "../bezeg/bezier-curve";
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";

/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
export class JSXBezierCurve extends AbstractJSXBezierCurve<BezierCurve> {

    subdivide(t: number): this {
        const [curve1, curve2]: BezierCurve[] = this.bezierCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        return new JSXBezierCurve(curve2pointArray, this.board) as this
    }

    elevate() {
        const elevated = this.bezierCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.bezierCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: BezierCurve = this.bezierCurve.extrapolate(t)
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    protected getStartingCurve(points: number[][]): BezierCurve {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new BezierCurve(jsxPoints);
    }
}
