import {PointImpl} from "./point/point-impl";
import {Point} from "./interfaces/point";
import {BezierCurve} from "./interfaces/bezier-curve";
import {PointControlledCurveImpl} from "./point-controlled-curve-impl";

import {CacheContext} from "../graphs/context/CacheContext";


export class BezierCurveImpl extends PointControlledCurveImpl implements BezierCurve {
    private lastCacheContext?: number;
    private cachedPointAtT?: PointImpl;
    private cachedPoints: Map<number, PointImpl> = new Map();

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
        return new BezierCurveImpl(newPoints) as this
    }

    /**
     * Calculates a point on this curve at parameter t.
     * @param {number} t
     * @returns {Point} point
     */
    calculatePointAtT(t: number): Point {
        const currentContext = CacheContext.context
        if (currentContext !== this.lastCacheContext) {
            this.cachedPoints.clear()
            this.lastCacheContext = currentContext
        }
        const cached = this.cachedPoints.get(t)
        if (!this.cachedPointAtT || cached === undefined) {
            const pointsAtT = this.points.map(point => [point.X(), point.Y()])
            const decasteljauInternal = this.decasteljau(t, pointsAtT)
            const [x, y] = decasteljauInternal[decasteljauInternal.length - 1][0]
            this.cachedPointAtT = new PointImpl(x, y);
            this.cachedPoints.set(t, new PointImpl(x, y))
        }
        return this.cachedPoints.get(t)!
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
        const newPoints = decasteljauScheme.map(row => row[0])
        return new BezierCurveImpl(newPoints) as this
    }

    /**
     * Returns two bezier curves that together form the current one.
     * @param t
     */
    subdivide(t: number): this[] {
        const decasteljauScheme = this.decasteljauScheme(t)
        const n = decasteljauScheme.length
        const points1 = decasteljauScheme.map(row => row[0])
        const points2 = decasteljauScheme.map((row, i) => row[n - 1 - i]).reverse()
        const bezierCurve1 = new BezierCurveImpl(points1)
        const bezierCurve2 = new BezierCurveImpl(points2)
        return [bezierCurve1, bezierCurve2] as this[]
    };

    decasteljau(t: number, pointsAtT: number[][]): number[][][] {
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