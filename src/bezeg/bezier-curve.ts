import {PointImpl} from "./point/point-impl";
import {Point} from "./point/point";


export class BezierCurve {
    protected points: Array<Point>;

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

    getPoints() {
        return this.points
    }

    elevate(): this {
        let newPoints = [];
        newPoints.push(this.points[0])
        let n = this.points.length, x, y
        for (let i = 1; i < n; i++) {
            x = i / n * this.points[i - 1].X() + (1 - i / n) * this.points[i].X()
            y = i / n * this.points[i - 1].Y() + (1 - i / n) * this.points[i].Y()
            newPoints.push(new PointImpl(x, y))
        }
        newPoints.push(this.points[n - 1])
        return new BezierCurve(newPoints) as this
    }

    /**
     * Calculates a point on this curve at parameter t.
     * @param {number} t
     * @returns {Point} point
     */
    calculatePointAtT(t: number): Point {
        const pointsAtT = this.points.map(point => [point.X(), point.Y()])
        const decasteljauInternal = this.decasteljau(t, pointsAtT)
        const [x, y] = decasteljauInternal[decasteljauInternal.length - 1][0]
        return new PointImpl(x, y);
    }

    scale(xScale: number): void;
    scale(xScale: number, yScale: number): void;
    scale(xScale: number, yScale?: number): void {
        if (yScale === undefined) {
            yScale = xScale
        }
        this.affineTransform([[xScale, 0], [0, yScale]])
    }

    moveFor(x: number, y: number): void {
        this.affineTransform([[1, 0], [0, 1]], [x, y])
    }

    flip(x: boolean, y: boolean) {
        this.affineTransform([[x ? -1 : 1, 0], [0, y ? -1 : 1]])
    }

    /**
     * Rotates the curve around origin by theta.
     * @param theta angle of rotation in radians
     */
    rotate(theta: number) {
        const rotationMatrix = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]
        this.affineTransform(rotationMatrix)
    }

    getBoundingBox() {
        let maxX = -3000
        let maxY = -3000
        let minX = 3000
        let minY = 3000

        this.points.forEach(point => {
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

    getBoundingBoxCenter() {
        let [minX, maxX, minY, maxY] = this.getBoundingBox()
        return [(minX + maxX) / 2, (minY + maxY) / 2]

    }

    affineTransform(A: number [][]): void
    affineTransform(A: number [][], b?: number[]): void

    affineTransform(A: number[][], b?: number[], center?: number[]): void {
        if (!center) {
            center = this.getBoundingBoxCenter()
        }
        let [xCenter, yCenter] = center

        this.points.forEach(point => {
            let x = point.X()
            let y = point.Y()
            x = x - xCenter
            y = y - yCenter
            let newX = A[0][0] * x + A[0][1] * y
            let newY = A[1][0] * x + A[1][1] * y
            newX = newX + xCenter
            newY = newY + yCenter
            if (b) {
                newX = newX + b[0]
                newY = newY + b[1]
            }
            point.setX(newX)
            point.setY(newY)
        })

    }

    /**
     * Returns the full decasteljau scheme for desired t.
     * @param t
     */
    decasteljauScheme(t: number): Point[][] {
        const pointsAtT = this.points.map(point => [point.X(), point.Y()])
        const decasteljauInternal = this.decasteljau(t, pointsAtT)
        return decasteljauInternal.map(row => row.map(([x, y]) => new PointImpl(x, y)))
    }

    /**
     * Returns a new bezier curve that is the extrapolated version of the current one.
     * @param t
     */
    extrapolate(t: number): this {
        const decasteljauScheme = this.decasteljauScheme(t)
        const newPoints = decasteljauScheme.map((row, i) => row[0])
        return new BezierCurve(newPoints) as this
    }

    /**
     * Returns two bezier curves that together form the current one.
     * @param t
     */
    subdivide(t: number): this[] {
        const decasteljauScheme = this.decasteljauScheme(t)
        const n = decasteljauScheme.length
        const points1 = decasteljauScheme.map((row, i) => row[0])
        const points2 = decasteljauScheme.map((row, i) => row[n - 1 - i]).reverse()
        const bezierCurve1 = new BezierCurve(points1)
        const bezierCurve2 = new BezierCurve(points2)
        return [bezierCurve1, bezierCurve2] as this[]
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

    protected decasteljau(t: number, pointsAtT: number[][]): number[][][] {
        // TODO think about removing pointsAtT argument
        const decasteljauScheme = []
        const n = this.points.length
        decasteljauScheme.push(pointsAtT.map(row => [...row]))
        for (let r = 1; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                for (let d = 0; d < pointsAtT[i].length; d++) {
                    pointsAtT[i][d] = ((1 - t) * pointsAtT[i][d] + t * pointsAtT[i + 1][d])
                }
            }
            decasteljauScheme.push(pointsAtT.map(row => [...row]))
        }
        return decasteljauScheme
    }
}