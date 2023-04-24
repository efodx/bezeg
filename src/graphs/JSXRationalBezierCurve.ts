/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";
import {Board} from "jsxgraph";
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";

export class JSXRationalBezierCurve extends AbstractJSXBezierCurve<RationalBezierCurve> {

    constructor(points: number[][], weights: number[], board: Board) {
        super(points, board);
        this.pointControlledCurve.setWeights(weights)
    }

    addPoint(x: number, y: number) {
        super.addPoint(x, y)
        this.pointControlledCurve.getWeights().push(1)
    }

    subdivide(t: number): this {
        const [curve1, curve2]: RationalBezierCurve[] = this.pointControlledCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())
        this.pointControlledCurve.setWeights(curve1.getWeights())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        return new JSXRationalBezierCurve(curve2pointArray, curve2.getWeights(), this.board) as this
    }

    elevate() {
        const elevated = this.pointControlledCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.pointControlledCurve.setWeights(elevated.getWeights())
        this.pointControlledCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: RationalBezierCurve = this.pointControlledCurve.extrapolate(t)
        this.pointControlledCurve.setWeights(extrapolatedBezier.getWeights())
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    protected getStartingCurve(points: number[][]): RationalBezierCurve {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new RationalBezierCurve(jsxPoints, jsxPoints.map(() => 1));
    }
}
