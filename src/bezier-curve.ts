import {Point} from './point'
import {PointImpl} from "./PointImpl";


export class BezierCurve {
    private points: Array<Point>;

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     * @param {*} id
     */
    constructor(points: Array<Point>) {
        this.points = points
    }

    /**
     * Sets the control points.
     * @param {Array.<Point>} points
     */
    setPoints(points: Point[]) {
        this.points = points
    }

    /**
     * Calculates a point on this curve at parameter t.
     * @param {number} t
     * @returns {Point} point
     */
    calculatePointAtT(t: number) {
        const n = this.points.length
        const pointsAtT = this.points.map(point => new PointImpl(point.X(), point.Y()))
        for (let r = 1; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                pointsAtT[i].setX((1 - t) * pointsAtT[i].X() + t * pointsAtT[i + 1].X())
                pointsAtT[i].setY((1 - t) * pointsAtT[i].Y() + t * pointsAtT[i + 1].Y())
            }
        }
        return pointsAtT[0]
    }

    decasteljau(t: number) {
        const decasteljauScheme = []
        const n = this.points.length
        const pointsAtT = this.points.map(point => new PointImpl(point.X(), point.Y()))
        decasteljauScheme.push(pointsAtT.map(point => new PointImpl(point.X(), point.Y())))
        for (let r = 1; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                pointsAtT[i].setX((1 - t) * pointsAtT[i].X() + t * pointsAtT[i + 1].X())
                pointsAtT[i].setY((1 - t) * pointsAtT[i].Y() + t * pointsAtT[i + 1].Y())
            }
            decasteljauScheme.push(pointsAtT.map(point => new PointImpl(point.X(), point.Y())))
        }
        return decasteljauScheme
    }

    /**
     * Removes control point with id. If id doesn't exist, nothing gets removed.
     * @param {*} id
     */
    removePoint(point: Point) {
        this.points = this.points.filter(point2 => point2 != point)
    }

    /**
     * Adds a control point to the end of this Curve.
     * @param {Point} point
     */
    addPoint(point: Point) {
        this.points.push(point)
    }

}