import {Point} from "../../api/point/point";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {PointImpl} from "../point/point-impl";
import {PointControlledCurveImpl} from "./point-controlled-curve-impl";

enum Continuity {
    C0, C1, G1, C2, G2
}

class BezierSpline extends PointControlledCurveImpl {
    private degree: number;
    private continuity: Continuity;
    private bezierCurves: BezierCurveImpl[];
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
                for (let i = 0; i < this.points.length; i = i + step) {
                    let bezierCurvePoints = this.points.slice(i, i + step + 1)
                    this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
                }
                break
            case Continuity.C1:
                step = this.degree;
                for (let i = 0; i < this.points.length - 1; i = i + step - 1) {
                    let bezierCurvePoints = this.points.slice(i, i + step)
                    let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                    if (!previousBezierCurve) {
                        bezierCurvePoints = this.points.slice(0, step)
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
                    } else {
                        let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2]
                        let startingPoint = bezierCurvePoints[0]
                        let nonFreePoint = new PointImpl(() => 2 * startingPoint.X() - previousPoint.X(), () => 2 * startingPoint.Y() - previousPoint.Y())
                        this.nonFreePoints.push(nonFreePoint)
                        bezierCurvePoints.splice(1, 0, nonFreePoint)
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
                    }
                }
                break
            case Continuity.G1:
                step = this.degree;
                for (let i = 0; i < this.points.length - 1; i = i + step - 1) {
                    let bezierCurvePoints = this.points.slice(i, i + step)
                    let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                    if (!previousBezierCurve) {
                        bezierCurvePoints = this.points.slice(0, step)
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
                    } else {
                        let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2]
                        let startingPoint = bezierCurvePoints[0]

                        this.b.push(1)
                        let j = this.b.length - 1
                        let nonFreePoint = new PointImpl(() => startingPoint.X() + this.b[j] * (startingPoint.X() - previousPoint.X()), () => startingPoint.Y() + this.b[j] * (startingPoint.Y() - previousPoint.Y()))
                        this.nonFreePoints.push(nonFreePoint)
                        bezierCurvePoints.splice(1, 0, nonFreePoint)
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
                    }
                }
                break
            case Continuity.C2:
                step = this.degree;
                for (let i = 0; i < this.points.length - 1; i = i + step - 1) {
                    let bezierCurvePoints = this.points.slice(i, i + step)
                    let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]
                    if (!previousBezierCurve) {
                        bezierCurvePoints = this.points.slice(0, step)
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
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
                        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
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

    getContinuity() {
        return this.continuity
    }

    setDegree(degree: number) {
        this.degree = degree
    }

    getDegree() {
        return this.degree
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

    getAllCurvePoints(): Point[] {
        const points: Point[] = []
        points.push(...this.bezierCurves[0].getPoints())
        this.bezierCurves.slice(1).forEach(curve => {
            points.push(...curve.getPoints().slice(1))
        })
        return points
    }

    override addPoint(point: Point) {
        super.addPoint(point)
        this.generateBezierCurves()
    }

    override removePoint(point: Point) {
        super.removePoint(point)
        this.generateBezierCurves()
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