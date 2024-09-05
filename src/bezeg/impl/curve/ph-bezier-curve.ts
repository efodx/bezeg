import {Point} from "../../api/point/point";
import {PointImpl} from "../point/point-impl";
import {BezierCurve} from "../../api/curve/bezier-curve";
import {PolynomialBezierCurve} from "./polynomial-bezier-curve";
import {RationalBezierCurve} from "./rational-bezier-curve";
import {AbstractPointControlledCurve} from "./abstract-point-controlled-curve";

const deltaPravokoten = (p0: Point, p1: Point) => new PointImpl(() => p1.Y() - p0.Y(), () => p0.X() - p1.X());
const bin = (n: number, k: number): number => k === 0 ? 1 : (n * bin(n - 1, k - 1)) / k;

/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 */
export class PhBezierCurve extends AbstractPointControlledCurve implements BezierCurve {
    private d: number = 0.2;
    private underlyingBezierCurve: BezierCurve;
    private underlyingCurveControlPoints: Point[];
    private offsetCurves: BezierCurve[] = [];
    private sigmas: Array<() => number>;
    private bezierCurveS?: BezierCurve;
    private bezierCurveSigma?: BezierCurve;

    constructor(points: Point[], w: Point[]) {
        super(points);
        this._w = w;
        this.underlyingCurveControlPoints = this.generatePointsForDegree(this.degree);
        this.underlyingBezierCurve = new PolynomialBezierCurve(this.underlyingCurveControlPoints);
        this.sigmas = this.generateSigmas(this.degree);
        this.addOffsetCurve();
        this.addOffsetCurve();
    }

    private _w: Point[];

    get w(): Point[] {
        return this._w;
    }

    set w(value: Point[]) {
        this._w = value;
    }

    get degree() {
        return 2 * this._w.length - 1;
    }

    addOffsetCurve() {
        const len = this.offsetCurves.length;
        let [rpoints2, rweights2] = this.generateOffsetCurvePoints(this.degree, () => (len + 1) * this.d);
        this.offsetCurves.push(new RationalBezierCurve(rpoints2, rweights2));
    }

    removeOffsetCurve() {
        this.offsetCurves.pop();
    }

    tk(tkminus1: number, deltas: number, k: number) {
        let tk0 = tkminus1 + deltas / this.sigma(tkminus1);
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0);
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0);
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0);
        tk0 = tk0 - (this.s(tk0) - k * deltas) / this.sigma(tk0);
        return tk0;
    }

    s(t: number) {
        if (!this.bezierCurveS) {
            const s = [];
            const lastS = this.sigmas.reduce((acc, sigma) => {
                    // The intermediate ones are calculated here
                    s.push(acc);
                    return () => acc() + 1 / this.degree * sigma();
                },
                () => 0);
            s.push(lastS);
            this.bezierCurveS = new PolynomialBezierCurve(s.map(p => new PointImpl(p, 1)));
        }
        return this.bezierCurveS.calculatePointAtT(t).X();

    }

    sigma(t: number) {
        if (!this.bezierCurveSigma) {
            this.bezierCurveSigma = new PolynomialBezierCurve(this.sigmas.map(sigma => new PointImpl(sigma, 1)));
        }
        return this.bezierCurveSigma.calculatePointAtT(t).X();
    }

    getOffsetCurves() {
        return this.offsetCurves;
    }

    setOffsetCurveDistance(d: number) {
        this.d = d;
    }

    getOffsetCurveDistance() {
        return this.d;
    }

    generateSigmas(n: number) {
        const m = (n - 1) / 2;
        const sigma = [];
        for (let k = 0; k < n; k++) {
            const sumEndId = Math.min(m, k);
            const sumStartId = Math.max(0, k - m);
            const sSumParts: Point[] = [];
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(m, j) / bin(n - 1, k) * bin(m, k - j);
                // We also pack the calculation of sigma in a point for some caching, ideally Point would be of any dimension
                const sSumPart = new PointImpl(() => scalar * (this._w[j].X() * this._w[k - j].X() + this._w[j].Y() * this._w[k - j].Y()), 0);
                sSumParts.push(sSumPart);
            }
            const sigmaK = new PointImpl(() => sSumParts.reduce((acc, part) => part.X() + acc, 0), 0);
            sigma.push(() => sigmaK.X());
        }
        return sigma;
    }

    generateOffsetCurvePoints(n: number, d: () => number): [Point[], Array<() => number>] {
        const p: Point[] = this.underlyingCurveControlPoints;

        const sigma = this.sigmas;
        const deltaPravokotenP = p.slice(1).map((pp, i) => deltaPravokoten(p[i], pp));

        const numOfPoints = 2 * n;
        const o = [];
        const w = [];
        for (let k = 0; k < numOfPoints; k++) {
            const sumEndId = Math.min(n - 1, k);
            const sumStartId = Math.max(0, k - n);
            const sumParts: Point[] = [];
            const wSumParts: Point[] = [];
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(n - 1, j) / bin(2 * n - 1, k) * bin(n, k - j);
                // We make these into points to make use of the caching system behind them
                const sumPart = new PointImpl(() => scalar * (sigma[j]() * p[k - j].X() + d() * n * deltaPravokotenP[j].X()),
                    () => scalar * (sigma[j]() * p[k - j].Y() + d() * n * deltaPravokotenP[j].Y()));
                sumParts.push(sumPart);

                // We also pack the calculation of w in a point for some caching, ideally Point would be of any dimension
                const wSumPart = new PointImpl(() => scalar * sigma[j](), 0);
                wSumParts.push(wSumPart);
            }
            const wk = new PointImpl(() => wSumParts.reduce((acc, part) => part.X() + acc, 0), 0);
            w.push(() => wk.X());
            const ok = new PointImpl(
                () => sumParts.reduce((acc, part) => part.X() + acc, 0) / wk.X(),
                () => sumParts.reduce((acc, part) => part.Y() + acc, 0) / wk.X());
            o.push(ok);
        }
        return [o, w];
    }

    generatePointsForDegree(n: number): Point[] {
        const points = [this.points[0]];
        const m = this._w.length;

        for (let k = 0; k < n; k++) {
            const sumEndId = Math.min(k, m - 1);
            const sumStartId = Math.max(0, k - m + 1);
            const pSumParts: Point[] = [];
            for (let j = sumStartId; j <= sumEndId; j++) {
                const scalar = bin(m - 1, j) / bin(2 * m - 2, k) * bin(m - 1, k - j);
                // We also pack the calculation of sigma in a point for some caching, ideally Point would be of any dimension
                const pSumPart = new PointImpl(
                    () => scalar * (this._w[j].X() * this._w[k - j].X() - this._w[j].Y() * this._w[k - j].Y()),
                    () => scalar * (this._w[j].X() * this._w[k - j].Y() + this._w[j].Y() * this._w[k - j].X()));
                pSumParts.push(pSumPart);
            }
            const point = new PointImpl(() => points[k].X() + 1 / n * pSumParts.reduce((acc, part) => part.X() + acc, 0),
                () => points[k].Y() + 1 / n * pSumParts.reduce((acc, part) => part.Y() + acc, 0));
            points.push(point);
        }
        return points;
    }

    // Delegate Methods for the underlying bezier curve
    subdivide(t: number): BezierCurve[] {
        // TODO this shouldnt really be used...
        return this.underlyingBezierCurve.subdivide(t);
    }

    decasteljau(t: number, pointsAtT: number[][]): number[][][] {
        // TODO this shouldnt really be used...
        return this.underlyingBezierCurve.decasteljau(t, pointsAtT);
    }

    override rotate(theta: number) {
        const rotateByHalfTheta = [[Math.cos(theta / 2), -Math.sin(theta / 2)], [Math.sin(theta / 2), Math.cos(theta / 2)]];
        const [cX, cY] = [this.underlyingBezierCurve.getPoints().map(point => point.X()).reduce((previousValue, currentValue) => previousValue + currentValue) / this.underlyingBezierCurve.getPoints().length,
            this.underlyingBezierCurve.getPoints().map(point => point.Y()).reduce((previousValue, currentValue) => previousValue + currentValue) / this.underlyingBezierCurve.getPoints().length];
        this._w.forEach(point => this.transformPoint(point, 0, 0, rotateByHalfTheta, undefined));
        const rotateByTheta = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
        const newCenter = new PointImpl(cX, cY);
        this.transformPoint(newCenter, this.points[0].X(), this.points[0].Y(), rotateByTheta, undefined);
        this.moveFor(cX - newCenter.X(), cY - newCenter.Y());
    }

    elevate(): BezierCurve {
        return this.underlyingBezierCurve.elevate();
    }

    decasteljauScheme(t: number): Point[][] {
        return this.underlyingBezierCurve.decasteljauScheme(t);
    }

    override scale(xScale: number) {
        xScale = Math.sqrt(xScale);
        this._w.forEach(point => this.transformPoint(point, 0, 0, [[xScale, 0], [0, xScale]], undefined));
        const [cX, cY] = this.getBoundingBoxCenter();
        const newCenter = new PointImpl(cX, cY);
        this.transformPoint(newCenter, this.points[0].X(), this.points[0].Y(), [[xScale, 0], [0, xScale]], undefined);
        this.moveFor(2 * (cX - newCenter.X()), 2 * (cY - newCenter.Y()));
    }

    override getBoundingBox(): number[] {
        return this.underlyingBezierCurve.getBoundingBox();
    }

    extrapolate(t: number): BezierCurve {
        return this.underlyingBezierCurve.extrapolate(t);
    }

    override getPoints(): Point[] {
        return this.underlyingBezierCurve.getPoints();
    }

    calculatePointAtT(t: number): Point {
        return this.underlyingBezierCurve.calculatePointAtT(t);
    }

    override getConvexHull(): Point[] {
        return this.underlyingBezierCurve.getConvexHull();
    }

}