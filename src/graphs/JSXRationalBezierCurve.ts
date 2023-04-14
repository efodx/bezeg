/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";
import {Board} from "jsxgraph";

export class JSXRationalBezierCurve extends AbstractJSXBezierCurve<RationalBezierCurve> {

    constructor(points: number[][], weights: number[], board: Board) {
        super(points, board);
        this.bezierCurve.setWeights(weights)
    }

    addPoint(x: number, y: number) {
        super.addPoint(x, y)
        this.bezierCurve.getWeights().push(1)
    }

    subdivide(t: number): this {
        const [curve1, curve2]: RationalBezierCurve[] = this.bezierCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())
        this.bezierCurve.setWeights(curve1.getWeights())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        return new JSXRationalBezierCurve(curve2pointArray, curve2.getWeights(), this.board) as this
    }

    elevate() {
        const elevated = this.bezierCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.bezierCurve.setWeights(elevated.getWeights())
        this.bezierCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: RationalBezierCurve = this.bezierCurve.extrapolate(t)
        this.bezierCurve.setWeights(extrapolatedBezier.getWeights())
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    protected getStartingCurve(points: number[][]): RationalBezierCurve {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new RationalBezierCurve(jsxPoints, jsxPoints.map(() => 1));
    }
}
