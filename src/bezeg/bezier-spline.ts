import {Point} from "./point/point";
import {BezierCurve} from "./bezier-curve";
import {PointImpl} from "./point/point-impl";

export class BezierSpline {
    private points: Array<Point>;
    private degree: number;
    private continuity: number;
    private bezierCurves: BezierCurve[];
    private nonFreePoints: Array<Point> = []
    private b: number[] = []

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     * @param degree
     * @param continuity
     */
    constructor(points: Array<Point>, degree: number, continuity: number) {
        this.points = points
        this.degree = degree
        this.continuity = continuity
        this.bezierCurves = []

        // TODO parameters correctness check
        if (continuity === 0) {
            let step = degree;
            console.log(points.length) // 7
            for (let i = 0; i < this.points.length - step; i = i + step) {
                let bezierCurvePoints = this.points.slice(i, i + step + 1)
                this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
            }
        }
        if (continuity === 0.5) {
            let step = degree;
            for (let i = 0; i < this.points.length - step + 1; i = i + step - 1) {
                let bezierCurvePoints = this.points.slice(i, i + step)
                let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                if (!previousBezierCurve) {
                    bezierCurvePoints = this.points.slice(0, step)
                    this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                } else {
                    let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2]
                    let startingPoint = bezierCurvePoints[0]

                    this.b.push(1)
                    let j = this.b.length - 1
                    let nonFreePoint = new PointImpl(() => startingPoint.X() + this.b[j] * (startingPoint.X() - previousPoint.X()), () => startingPoint.Y() + this.b[j] * (startingPoint.Y() - previousPoint.Y()))
                    this.nonFreePoints.push(nonFreePoint)
                    bezierCurvePoints.splice(1, 0, nonFreePoint)
                    this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                }
            }
        }
        if (continuity === 1) {
            let step = degree;
            for (let i = 0; i < this.points.length - step + 1; i = i + step - 1) {
                let bezierCurvePoints = this.points.slice(i, i + step)
                let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                if (!previousBezierCurve) {
                    bezierCurvePoints = this.points.slice(0, step)
                    this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                } else {
                    let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2]
                    let startingPoint = bezierCurvePoints[0]
                    let nonFreePoint = new PointImpl(() => 2 * startingPoint.X() - previousPoint.X(), () => 2 * startingPoint.Y() - previousPoint.Y())
                    this.nonFreePoints.push(nonFreePoint)
                    bezierCurvePoints.splice(1, 0, nonFreePoint)
                    this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                }
            }
        }

    }

    calculatePointAtT(t: number): Point {
        // todo param check
        // t = 0.5 moram dobit c = 2, t = 0.5
        if (t === 1) {
            return this.bezierCurves[this.bezierCurves.length - 1].calculatePointAtT(1)
        }
        let n = this.bezierCurves.length
        let c = Math.floor(n * t)
        t = n * t - c
        return this.bezierCurves[c].calculatePointAtT(t)

    }

    setB(j: number, b: number) {
        this.b[j] = b
    }

    getB(j: number) {
        return this.b[j]
    }

    getNonFreePoints() {
        return this.nonFreePoints
    }

}