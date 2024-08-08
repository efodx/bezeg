import {Point} from "../../api/point/point";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {PointImpl} from "../point/point-impl";
import {PointControlledCurveImpl} from "./point-controlled-curve-impl";

enum Continuity {
    C0, C1, G1, C2, G2, C3
}

class BezierSpline extends PointControlledCurveImpl {
    private degree: number;
    private continuity: Continuity;
    private bezierCurves: BezierCurveImpl[];
    private nonFreePoints: Array<Point> = []
    private b: number[] = []
    private alpha: number = 1;

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

        this.generateBezierCurves()
    }

    setAlpha(alpha: number) {
        this.alpha = alpha
    }

    getAlpha() {
        return this.alpha
    }

    generateBezierCurves() {
        this.bezierCurves = []
        this.nonFreePoints = []
        let step;
        if (this.degree < 2) {
            return
        }

        // To achieve locality, 2c < degree
        switch (this.continuity) {
            case Continuity.C0:
                this.generateForContinuity(0)
                break
            case Continuity.C1:
                this.generateForContinuity(1);
                break
            case Continuity.C2:
                this.generateForContinuity(2);
                break
            case Continuity.C3:
                this.generateForContinuity(3);
                break
            case Continuity.G1:
                step = this.degree;
                this.b = []
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
        let ts: number[] = [0]
        for (let i = 0; i < n; i++) {
            let curve = this.bezierCurves[i]
            let pointStart = curve.getPoints()[0]
            let pointEnd = curve.getPoints()[curve.getPoints().length - 1]
            let d = Math.sqrt((pointStart.X() - pointEnd.X()) ** 2 + (pointStart.Y() - pointEnd.Y()) ** 2) ** this.alpha
            ts.push(ts[ts.length - 1] + d)
        }
        ts = ts.map(t => t / ts[ts.length - 1])
        for (let c = 0; c < n; c++) {
            if (t < ts[c + 1]) {
                t = t - ts[c]
                t = t / (ts[c + 1] - ts[c])
                return this.bezierCurves[c].calculatePointAtT(t)
            }
        }
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
        console.log("setting: " + j)
        console.log(this.b)
        this.b[j] = b
    }

    getB(j: number) {
        return this.b[j]
    }

    getNumOfBs() {
        return this.b.length
    }

    getNonFreePoints() {
        return this.nonFreePoints
    }

    override getPoints(): Point[] {
        return this.getAllCurvePoints();
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

    private generateForContinuity(c: number) {
        let step = this.degree - c;
        let bezierCurvePoints = this.points.slice(0, this.degree + 1)
        this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))

        for (let i = this.degree; i < this.points.length - 1; i = i + step) {
            let bezierCurvePoints = [this.points[i]]

            let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1]

            const nonFreePoints = []
            for (let j = 1; j <= c; j++) {
                // TODO MAKE THIS EFFICIENT
                let nonFreePoint = new PointImpl(() => {
                    let bc = previousBezierCurve.extrapolate(2)
                    let [lc, rc] = bc.subdivide(0.5)
                    return rc.getPoints()[j].X()
                }, () => {
                    let bc = previousBezierCurve.extrapolate(2)
                    let [lc, rc] = bc.subdivide(0.5)
                    return rc.getPoints()[j].Y()
                })
                nonFreePoints.push(nonFreePoint)
                bezierCurvePoints.push(nonFreePoint)
                // let nonFreePoint = new PointImpl(() => 2 * startingPoint.X() - previousPoint.X(), () => 2 * startingPoint.Y() - previousPoint.Y())
            }

            bezierCurvePoints.push(...this.points.slice(i + 1, i + step + 1))
            this.nonFreePoints.push(...nonFreePoints)
            this.bezierCurves.push(new BezierCurveImpl(bezierCurvePoints))
        }
    }

}


export {Continuity, BezierSpline}