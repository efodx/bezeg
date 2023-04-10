import {PointImpl} from "./point/point-impl";
import {Point} from "./point/point";
import {BezierCurve} from "./bezier-curve";


export class RationalBezierCurve extends BezierCurve {
    private weights: Array<number>;

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     * @param weights - Curve's weights
     */
    constructor(points: Array<Point>, weights: Array<number>) {
        super(points)
        this.weights = weights
    }

    elevate(): this {
        let newPoints = [];
        let newWeights = []
        newPoints.push(this.points[0])
        newWeights.push(this.weights[0])
        let n = this.points.length, x, y
        for (let i = 1; i < n; i++) {
            let w1 = this.weights[i - 1]
            let w2 = this.weights[i]
            let w = i / n * w1 + (1 - i / n) * w2
            newWeights.push(w)
            x = i / n * this.points[i - 1].X() * w1 + (1 - i / n) * this.points[i].X() * w2
            y = i / n * this.points[i - 1].Y() * w1 + (1 - i / n) * this.points[i].Y() * w2

            x = x / w
            y = y / w
            newPoints.push(new PointImpl(x, y))
        }
        newPoints.push(this.points[n - 1])
        newWeights.push(this.weights[n - 1])
        return new RationalBezierCurve(newPoints, newWeights) as this
    }

    setWeights(weights: number[]) {
        this.weights = weights
    }

    getWeights(): number[] {
        return this.weights
    }

    /**
     * Returns a new bezier curve that is the extrapolated version of the current one.
     * @param t
     */
    extrapolate(t: number): this {
        const points = this.points.map((point, i) => [point.X() * this.weights[i], point.Y() * this.weights[i], this.weights[i]])
        const decasteljauScheme = super.decasteljau(t, points)
        const pointsToProject = decasteljauScheme.map((row, i) => row[0])
        const actualPoints = pointsToProject.map(p => new PointImpl(p[0] / p[2], p[1] / p[2]))
        const weights = pointsToProject.map(p => p[2])
        return new RationalBezierCurve(actualPoints, weights) as this
    }

    /**
     * Returns two bezier curves that together form the current one.
     * @param t
     */
    subdivide(t: number): this[] {
        const points = this.points.map((point, i) => [point.X() * this.weights[i], point.Y() * this.weights[i], this.weights[i]])
        const decasteljauScheme = super.decasteljau(t, points)
        const n = decasteljauScheme.length
        const points1 = decasteljauScheme.map((row, i) => row[0])
        const points2 = decasteljauScheme.map((row, i) => row[n - 1 - i]).reverse()
        const actualPoints1 = points1.map(p => new PointImpl(p[0] / p[2], p[1] / p[2]))
        const actualWeights = points1.map(p => p[2])
        const actualPoints2 = points2.map(p => new PointImpl(p[0] / p[2], p[1] / p[2]))
        const actualWeights2 = points2.map(p => p[2])
        const bezierCurve1 = new RationalBezierCurve(actualPoints1, actualWeights)
        const bezierCurve2 = new RationalBezierCurve(actualPoints2, actualWeights2)
        return [bezierCurve1, bezierCurve2] as this[]
    };

    /**
     * Returns the full decasteljau scheme for desired t.
     * @param t
     * @param pointsAtT
     */
    protected decasteljau(t: number, pointsAtT: number[][]): number[][][] {
        // TODO think about removing pointsAtT argument
        const decasteljauScheme = []
        const n = this.points.length
        const weightsAtT = this.weights.map(w => w)
        decasteljauScheme.push(pointsAtT.map(row => [...row]))
        let w1, w2;
        for (let r = 1; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                w1 = weightsAtT[i]
                w2 = weightsAtT[i + 1]
                weightsAtT[i] = (1 - t) * w1 + t * w2
                w1 = w1 / weightsAtT[i]
                w2 = w2 / weightsAtT[i]
                for (let d = 0; d < pointsAtT[i].length; d++) {
                    pointsAtT[i][d] = ((1 - t) * w1 * pointsAtT[i][d] + t * w2 * pointsAtT[i + 1][d])
                }
            }
            decasteljauScheme.push(pointsAtT.map(row => [...row]))
        }
        return decasteljauScheme
    }

}