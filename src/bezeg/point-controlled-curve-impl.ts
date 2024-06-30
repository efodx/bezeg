import {Point} from "./interfaces/point";
import {PointControlledCurve} from "./interfaces/point-controlled-curve";

export abstract class PointControlledCurveImpl implements PointControlledCurve {
    points: Array<Point>;

    constructor(points: Array<Point>) {
        this.points = points
    }

    abstract calculatePointAtT(t: number): Point;

    /**
     * Sets the control points.
     * @param {Array.<Point>} points
     */
    setPoints(points: Point[]) {
        this.points = points
    }

    getPoints(): Point[] {
        return this.points
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
        let maxX = -Infinity
        let maxY = -Infinity
        let minX = Infinity
        let minY = Infinity

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
            this.transformPoint(point, xCenter, yCenter, A, b);
        })

    }

    transformPoint(point: Point, xCenter: number, yCenter: number, A: number[][], b?: number[]) {
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
        // This is so that we don't override points that have their coordinated fixed by others
        if (!point.isXFunction()) {
            point.setX(newX)
        }
        if (!point.isYFunction()) {
            point.setY(newY)
        }
    }

    /**
     * Removes control point with id. If id doesn't exist, nothing gets removed.
     * @param point
     */
    removePoint(point: Point) {
        this.points = this.points.filter(point2 => point2 !== point)
    }

    /**
     * Adds a control point to the end of this Curve.
     * @param {Point} point
     */
    addPoint(point: Point) {
        this.points.push(point)
    }

    getConvexHull(): Point[] {
        const allPoints = this.points.map(point => point)
        const leftMostPoint = allPoints.sort((p1, p2) => p1.X() === p2.X() ? p1.Y() - p2.Y() : p1.X() - p2.X())[0]
        const pointsOnHull = [leftMostPoint]
        while (true) {
            const current = pointsOnHull[pointsOnHull.length - 1]
            const next = allPoints.filter(point => point !== current).filter(point => this.everyOtherOnTheLeft(current, point, allPoints))[0]
            if (pointsOnHull.includes(next)) {
                break
            }
            if (next !== undefined) {
                pointsOnHull.push(next)
            }
        }
        return pointsOnHull
    }

    private everyOtherOnTheLeft(current: Point, point: Point, allPoints: Point[]) {
        return allPoints.filter(p => p !== current && p !== point).every(p => this.isPointOnLeft(current, point, p))
    }

    private isPointOnLeft(current: Point, point: Point, p: Point) {
        // Ax * By - Ay * Bx
        // (p-current)(point-current)
        return ((p.X() - current.X()) * (point.Y() - current.Y()) - (p.Y() - current.Y()) * (point.X() - current.X())) <= 0
    }

}