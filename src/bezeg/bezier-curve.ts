
import {PointImpl} from "./point/point-impl";
import {Point} from "./point/point";


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

    getPoints(){
        return this.points
    }

    /**
     * Calculates a point on this curve at parameter t.
     * @param {number} t
     * @returns {Point} point
     */
    calculatePointAtT(t: number): Point {
        const n = this.points.length
        const pointsAtT = this.points.map(point => new PointImpl(point.X(), point.Y()))
        for (let r = 1; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                pointsAtT[i].setX((1 - t) * pointsAtT[i].X() + t * pointsAtT[i + 1].X())
                pointsAtT[i].setY((1 - t) * pointsAtT[i].Y() + t * pointsAtT[i + 1].Y())
            }
        }
        if(pointsAtT[0]){}
        else{console.log("WTF IS GOIN ON " + t)
            console.log(this.points)}

        return pointsAtT[0]
    }

    /**
     * Returns the full decasteljau scheme for desired t.
     * @param t
     */
    decasteljau(t: number): Point[][] {
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
     * Returns a new bezier curve that is the extrapolated version of the current one.
     * @param t
     */
    extrapolate(t: number): BezierCurve {
        const decasteljauScheme = this.decasteljau(t)
        const newPoints = decasteljauScheme.map((row, i) => row[0])
        return new BezierCurve(newPoints)
    }
    /**
     * Returns two bezier curves that together form the current one.
     * @param t
     */
    subdivide(t:number): BezierCurve[]{
        const decasteljauScheme = this.decasteljau(t)
        const n = decasteljauScheme.length
        const points1 = decasteljauScheme.map((row, i) => row[0])
        const points2 = decasteljauScheme.map((row, i) => row[n - 1 - i]).reverse()
        const bezierCurve1 = new BezierCurve(points1)
        const bezierCurve2 = new BezierCurve(points2)
        return [bezierCurve1, bezierCurve2]
    };


    /**
     * Removes control point with id. If id doesn't exist, nothing gets removed.
     * @param point
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