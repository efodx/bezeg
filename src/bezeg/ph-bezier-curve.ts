import {Point} from "./interfaces/point";
import {PointImpl} from "./point/point-impl";
import {BezierCurve} from "./interfaces/bezier-curve";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {RationalBezierCurve} from "./rational-bezier-curve";

const deltaPravokoten = (p0: Point, p1: Point) => new PointImpl(() => p1.Y() - p0.Y(), () => p0.X() - p1.X())
const bin = (n: number, k: number): number => k == 0 ? 1 : (n * bin(n - 1, k - 1)) / k

/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 */
export class PhBezierCurve implements BezierCurve {
    private d: number = 0.2;
    private underlyingBezierCurve: BezierCurve;
    private points: Point[]
    private underlyingCurveControlPoints: Point[];
    private offsetCurve: BezierCurve;

    constructor(points: Point[], w: Point[]) {
        this.points = points
        this._w = w
        this.underlyingCurveControlPoints = this.generatePointsForDegree(this.degree)
        this.underlyingBezierCurve = new BezierCurveImpl(this.underlyingCurveControlPoints)
        let [rpoints, rweights] = this.generateOffsetCurvePoints(this.degree)
        this.offsetCurve = new RationalBezierCurve(rpoints, rweights)
    }

    private _w: Point[];

    get w(): Point[] {
        return this._w;
    }

    set w(value: Point[]) {
        this._w = value;
    }

    get degree() {
        return 2 * this._w.length - 1
    }

    tk(tkminus1: number, deltas: number, k: number) {
        let tk0 = tkminus1 + deltas / this.sigma(tkminus1)
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0)
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0)
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0)
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0)
        return tk0
    }

    s(t: number) {
        const sigma0 = () => this._w[0].X() ** 2 + this._w[0].Y() ** 2
        const sigma1 = () => this._w[0].X() * this._w[1].X() + this._w[0].Y() * this._w[1].Y()
        const sigma2 = () => this._w[1].X() ** 2 + this._w[1].Y() ** 2

        const s0 = () => 0
        const s1 = () => 1 / 3 * (sigma0())
        const s2 = () => 1 / 3 * (sigma0() + sigma1())
        const s3 = () => 1 / 3 * (sigma0() + sigma1() + sigma2())

        const p1 = new PointImpl(s0, 1)
        const p2 = new PointImpl(s1, 1)
        const p3 = new PointImpl(s2, 1)
        const p4 = new PointImpl(s3, 1)

        const bezierCurveS = new BezierCurveImpl([p1, p2, p3, p4])
        return bezierCurveS.calculatePointAtT(t).X()
    }

    sigma(t: number) {
        const sigma0 = () => this._w[0].X() ** 2 + this._w[0].Y() ** 2
        const sigma1 = () => this._w[0].X() * this._w[1].X() + this._w[0].Y() * this._w[1].Y()
        const sigma2 = () => this._w[1].X() ** 2 + this._w[1].Y() ** 2
        const p1 = new PointImpl(sigma0, 1)
        const p2 = new PointImpl(sigma1, 1)
        const p3 = new PointImpl(sigma2, 1)

        const bezierCurveSigma = new BezierCurveImpl([p1, p2, p3])
        return bezierCurveSigma.calculatePointAtT(t).X()
    }

    getOffsetCurve() {
        return this.offsetCurve
    }

    setOffsetCurveDistance(d: number) {
        this.d = d
    }

    getOffsetCurveDistance() {
        return this.d
    }

    generateSigmas(n: number) {
        const m = (n - 1) / 2
        const sigma = []
        for (let k = 0; k < n; k++) {
            const sumEndId = Math.min(m, k)
            const sumStartId = Math.max(0, k - m)
            const sSumParts: Point[] = []
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(m, j) / bin(n - 1, k) * bin(m, k - j)
                // We also pack the calculation of sigma in a point for some caching, ideally Point would be of any dimension
                const sSumPart = new PointImpl(() => scalar * (this._w[j].X() * this._w[k - j].X() + this._w[j].Y() * this._w[k - j].Y()), 0)
                sSumParts.push(sSumPart)
            }
            const sigmaK = new PointImpl(() => sSumParts.reduce((acc, part) => part.X() + acc, 0), 0)
            sigma.push(() => sigmaK.X())
        }
        return sigma
    }

    generateOffsetCurvePoints(n: number): [Point[], Array<() => number>] {
        const p: Point[] = this.underlyingCurveControlPoints

        const sigma = this.generateSigmas(n)
        const deltaPravokotenP = p.slice(1).map((pp, i) => deltaPravokoten(p[i], pp))

        const numOfPoints = 2 * n
        const o = []
        const w = []
        for (let k = 0; k < numOfPoints; k++) {
            const sumEndId = Math.min(n - 1, k)
            const sumStartId = Math.max(0, k - n)
            const sumParts: Point[] = []
            const wSumParts: Point[] = []
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(n - 1, j) / bin(2 * n - 1, k) * bin(n, k - j)
                // We make these points to make use of the caching system behind them
                const sumPart = new PointImpl(() => scalar * (sigma[j]() * p[k - j].X() + this.d * n * deltaPravokotenP[j].X()),
                    () => scalar * (sigma[j]() * p[k - j].Y() + this.d * n * deltaPravokotenP[j].Y()))
                sumParts.push(sumPart)

                // We also pack the calculation of w in a point for some caching, ideally Point would be of any dimension
                const wSumPart = new PointImpl(() => scalar * sigma[j](), 0)
                wSumParts.push(wSumPart)
            }
            const wk = new PointImpl(() => wSumParts.reduce((acc, part) => part.X() + acc, 0), 0)
            w.push(() => wk.X())
            const ok = new PointImpl(
                () => sumParts.reduce((acc, part) => part.X() + acc, 0) / wk.X(),
                () => sumParts.reduce((acc, part) => part.Y() + acc, 0) / wk.X())
            o.push(ok)
        }
        return [o, w]
    }

    generatePointsForDegree(n: number): Point[] {
        const points = [this.points[0]]
        const m = this._w.length

        for (let k = 0; k < n; k++) {
            const sumEndId = Math.min(k, m - 1)
            const sumStartId = Math.max(0, k - m + 1)
            const pSumParts: Point[] = []
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(m - 1, j) / bin(2 * m - 2, k) * bin(m - 1, k - j)
                // We also pack the calculation of sigma in a point for some caching, ideally Point would be of any dimension
                const pSumPart = new PointImpl(
                    () => scalar * (this._w[j].X() * this._w[k - j].X() - this._w[j].Y() * this._w[k - j].Y()),
                    () => scalar * (this._w[j].X() * this._w[k - j].Y() + this._w[j].Y() * this._w[k - j].X()))
                pSumParts.push(pSumPart)
            }
            const point = new PointImpl(() => points[k].X() + 1 / n * pSumParts.reduce((acc, part) => part.X() + acc, 0),
                () => points[k].Y() + 1 / n * pSumParts.reduce((acc, part) => part.Y() + acc, 0))
            points.push(point)
        }
        return points
    }

    // Delegate Methods for the underlying bezier curve
    subdivide(t: number): BezierCurve[] {
        return this.underlyingBezierCurve.subdivide(t);
    }

    setPoints(points: Point[]) {
        this.underlyingBezierCurve.setPoints(points);
    }

    flip(x: boolean, y: boolean) {
        this.underlyingBezierCurve.flip(x, y);
    }

    decasteljau(t: number, pointsAtT: number[][]): number[][][] {
        return this.underlyingBezierCurve.decasteljau(t, pointsAtT);
    }

    rotate(theta: number) {
        const rotationMatrix = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]
        this.affineTransform(rotationMatrix)
        this._w.forEach(point => this.transformPoint(point, 0, 0, rotationMatrix, undefined))
        // this.points.rotate!
        this.underlyingBezierCurve.rotate(theta);
    }

    elevate(): BezierCurve {
        return this.underlyingBezierCurve.elevate();
    }

    decasteljauScheme(t: number): Point[][] {
        return this.underlyingBezierCurve.decasteljauScheme(t);
    }

    scale(xScale: number) {
        let copyPoints = this.underlyingBezierCurve.getPoints()
            .map(point => new PointImpl(point.X(), point.Y()))
        copyPoints.forEach(point => this.transformPoint(point, 0, 0, [[xScale, 0], [0, xScale!]], undefined))

        this._w.forEach(point => this.transformPoint(point, 0, 0, [[xScale, 0], [0, xScale!]], undefined))
    }


    moveFor(x: number, y: number) {
        this.underlyingBezierCurve.moveFor(x, y);
    }

    getBoundingBox(): number[] {
        return this.underlyingBezierCurve.getBoundingBox();
    }

    transformPoint(point: Point, xCenter: number, yCenter: number, A: number[][], b: number[] | undefined) {
        this.underlyingBezierCurve.transformPoint(point, xCenter, yCenter, A, b);
    }

    addPoint(point: Point) {
        this.underlyingBezierCurve.addPoint(point);
    }

    extrapolate(t: number): BezierCurve {
        return this.underlyingBezierCurve.extrapolate(t);
    }

    getPoints(): Point[] {
        return this.underlyingBezierCurve.getPoints();
    }

    getBoundingBoxCenter(): number[] {
        return this.underlyingBezierCurve.getBoundingBoxCenter();
    }

    calculatePointAtT(t: number): Point {
        return this.underlyingBezierCurve.calculatePointAtT(t);
    }

    affineTransform(A: number[][]) {
        this.underlyingBezierCurve.affineTransform(A);
    }

    removePoint(point: Point) {
        this.underlyingBezierCurve.removePoint(point);
    }

}