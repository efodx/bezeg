import {Point} from "./point/point";
import {BezierCurve} from "./bezier-curve";
import {PointImpl} from "./point/point-impl";
import {PointControlledCurve} from "./point-controlled-curve";

enum Continuity {
    C0, C1, G1, C2, G2
}

class BezierSpline extends PointControlledCurve {
    private degree: number;
    private continuity: Continuity;
    private bezierCurves: BezierCurve[];
    private nonFreePoints: Array<Point> = []
    private b: number[] = []

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     * @param degree
     * @param continuity
     */
    constructor(points: Array<Point>, degree: number, continuity: Continuity) {
        super(points)
        this.degree = degree
        this.continuity = continuity
        this.bezierCurves = []

        // TODO parameters correctness check
        // TODO enum continuity
        this.generateBezierCurves()
    }


    generateBezierCurves() {
        this.bezierCurves = []
        this.nonFreePoints = []
        let step;
        if (this.degree <= 2) {
            // TODO redesign
            return
        }

        switch (this.continuity) {
            case Continuity.C0:
                step = this.degree;
                for (let i = 0; i < this.points.length - step; i = i + step) {
                    let bezierCurvePoints = this.points.slice(i, i + step + 1)
                    this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                }
                break
            case Continuity.C1:
                step = this.degree;
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
                break
            case Continuity.G1:
                step = this.degree;
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
                break
            case Continuity.C2:
                step = this.degree;
                for (let i = 0; i < this.points.length - step + 1; i = i + step - 1) {
                    let bezierCurvePoints = this.points.slice(i, i + step)
                    let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                    if (!previousBezierCurve) {
                        bezierCurvePoints = this.points.slice(0, step)
                        this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                    } else {
                        let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2]
                        let previousPoint2 = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 3]
                        let startingPoint = bezierCurvePoints[0]
                        let nonFreePoint = new PointImpl(() => 2 * startingPoint.X() - previousPoint.X(), () => 2 * startingPoint.Y() - previousPoint.Y())
                        let nonFreePoint2 = new PointImpl(() => previousPoint2.X() + 4 * (startingPoint.X() - previousPoint.X()), () => previousPoint2.Y() + 4 * (startingPoint.Y() - previousPoint.Y()))
                        this.nonFreePoints.push(nonFreePoint2)
                        this.nonFreePoints.push(nonFreePoint)
                        bezierCurvePoints.splice(1, 0, nonFreePoint2)
                        bezierCurvePoints.splice(1, 0, nonFreePoint)
                        this.bezierCurves.push(new BezierCurve(bezierCurvePoints))
                    }
                }
                break
            case Continuity.G2:
                throw "Not implemented"
        }
    }

    calculatePointAtT(t: number): Point {
        if (t === 1) {
            return this.bezierCurves[this.bezierCurves.length - 1].calculatePointAtT(1)
        }
        let n = this.bezierCurves.length
        let c = Math.floor(n * t)
        t = n * t - c
        return this.bezierCurves[c].calculatePointAtT(t)
    }

    setContinuity(continuity: Continuity) {
        this.continuity = continuity
    }

    setDegree(degree: number) {
        this.degree = degree
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

    override getBoundingBox() {
        let maxX = -Infinity
        let maxY = -Infinity
        let minX = Infinity
        let minY = Infinity
        // we include non-free points for this so the curve is always inside the bounding box, might change it to actual curve min and max
        const points = this.points.concat(this.getNonFreePoints())
        points.forEach(point => {
                if (point.X() > maxX) {
                    maxX = point.X()
                }
                if (point.Y() > maxY) {
                    maxY = point.Y()
                }
                if (point.X() < minX) {
                    minX = point.X()
                }
                if (point.Y() < minY) {
                    minY = point.Y()
                }
            }
        )
        return [minX, maxX, minY, maxY]
    }
}


export {Continuity, BezierSpline}