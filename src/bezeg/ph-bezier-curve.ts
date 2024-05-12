import {Point} from "./interfaces/point";
import {PointImpl} from "./point/point-impl";
import {BezierCurve} from "./interfaces/bezier-curve";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {RationalBezierCurve} from "./rational-bezier-curve";

const deltaPravokoten = (p0: Point, p1: Point) => new PointImpl(() => p1.Y() - p0.Y(), () => p0.X() - p1.X())

/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 * There are just certain restrictions.
 */
export class PhBezierCurve implements BezierCurve {
    private degree: number
    private d: number = 0.2;
    private underlyingBezierCurve: BezierCurve;
    private points: Point[]
    private underlyingCurveControlPoints: Point[];
    private offsetCurve: BezierCurve;
    private w: Point[];

    constructor(points: Point[], w: Point[]) {
        this.points = points
        this.w = w
        this.degree = points.length + this.w.length
        this.underlyingCurveControlPoints = this.generatePointsForUnderlyingBezierCurve(points)
        this.underlyingBezierCurve = new BezierCurveImpl(this.underlyingCurveControlPoints)
        let [rpoints, rweights] = this.generatePointsForOffsetCurve(points)
        this.offsetCurve = new RationalBezierCurve(rpoints, rweights)
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
        const w0 = this.w[0]
        const w1 = this.w[1]

        const sigma0 = () => w0.X() ** 2 + w0.Y() ** 2
        const sigma1 = () => w0.X() * w1.X() + w0.Y() * w1.Y()
        const sigma2 = () => w1.X() ** 2 + w1.Y() ** 2

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
        const w0 = this.w[0]
        const w1 = this.w[1]

        const sigma0 = () => w0.X() ** 2 + w0.Y() ** 2
        const sigma1 = () => w0.X() * w1.X() + w0.Y() * w1.Y()
        const sigma2 = () => w1.X() ** 2 + w1.Y() ** 2
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

    generatePointsForOffsetCurve(points: Array<Point>) {
        if (this.degree === 3) {
            return this.generateOffsetCurvePointsForDegree3(points)
        } else if (this.degree === 4) {
            return this.generateOffsetPointsForDegree5(points)
        }
        throw "Invalid points length. Must be of length 3 or 4."
    }

    generateOffsetCurvePointsForDegree3(points: Point[]): [Point[], Array<() => number>] {
        const w0 = this.w[0]
        const w1 = this.w[1]

        let [p0, p1, p2, p3] = this.underlyingCurveControlPoints

        const sigma0 = () => w0.X() ** 2 + w0.Y() ** 2
        const sigma1 = () => w0.X() * w1.X() + w0.Y() * w1.Y()
        const sigma2 = () => w1.X() ** 2 + w1.Y() ** 2

        const deltaPravokotenP0 = deltaPravokoten(p0, p1)
        const deltaPravokotenP1 = deltaPravokoten(p1, p2)
        const deltaPravokotenP2 = deltaPravokoten(p2, p3)


        const ww0 = () => sigma0();
        const ww1 = () => 1 / 5 * (2 * sigma1() + 3 * sigma0())
        const ww2 = () => 1 / 10 * (sigma2() + 6 * sigma1() + 3 * sigma0())
        const ww3 = () => 1 / 10 * (3 * sigma2() + 6 * sigma1() + sigma0())
        const ww4 = () => 1 / 5 * (3 * sigma2() + 2 * sigma1())
        const ww5 = () => sigma2()

        const o0 = new PointImpl(
            () => 1 / ww0() * (sigma0() * p0.X() + 3 * this.d * deltaPravokotenP0.X()),
            () => 1 / ww0() * (sigma0() * p0.Y() + 3 * this.d * deltaPravokotenP0.Y()))
        const o1 = new PointImpl(
            () => 1 / (5 * ww1()) * (2 * sigma1() * p0.X() + 3 * sigma0() * p1.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 2 * deltaPravokotenP1.X())),
            () => 1 / (5 * ww1()) * (2 * sigma1() * p0.Y() + 3 * sigma0() * p1.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 2 * deltaPravokotenP1.Y())))
        const o2 = new PointImpl(
            () => 1 / (10 * ww2()) * (sigma2() * p0.X() + 6 * sigma1() * p1.X() + 3 * sigma0() * p2.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + deltaPravokotenP2.X())),
            () => 1 / (10 * ww2()) * (sigma2() * p0.Y() + 6 * sigma1() * p1.Y() + 3 * sigma0() * p2.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + deltaPravokotenP2.Y())))
        const o3 = new PointImpl(
            () => 1 / (10 * ww3()) * (3 * sigma2() * p1.X() + 6 * sigma1() * p2.X() + sigma0() * p3.X() + 3 * this.d * (deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (10 * ww3()) * (3 * sigma2() * p1.Y() + 6 * sigma1() * p2.Y() + sigma0() * p3.Y() + 3 * this.d * (deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        const o4 = new PointImpl(
            () => 1 / (5 * ww4()) * (3 * sigma2() * p2.X() + 2 * sigma1() * p3.X() + 3 * this.d * (2 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (5 * ww4()) * (3 * sigma2() * p2.Y() + 2 * sigma1() * p3.Y() + 3 * this.d * (2 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        const o5 = new PointImpl(
            () => 1 / ww5() * (sigma2() * p3.X() + 3 * this.d * deltaPravokotenP2.X()),
            () => 1 / ww5() * (sigma2() * p3.Y() + 3 * this.d * deltaPravokotenP2.Y()))

        return [[o0, o1, o2, o3, o4, o5], [ww0, ww1, ww2, ww3, ww4, ww5]];
    }

    generateOffsetPointsForDegree5(points: Array<Point>): [Point[], Array<() => number>] {
        const w0 = points[1]
        const w1 = points[2]
        const w2 = points[3]

        let [p0, p1, p2, p3, p4, p5] = this.underlyingCurveControlPoints

        const sigma0 = () => w0.X() ** 2 + w0.Y() ** 2
        const sigma1 = () => w0.X() * w1.X() + w0.Y() * w1.Y()
        const sigma2 = () => 2 / 3 * (w1.X() ** 2 + w1.Y() ** 2) + 1 / 3 * (w0.X() * w2.X() + w0.Y() * w2.Y())
        const sigma3 = () => w1.X() * w2.X() + w1.Y() * w2.Y();
        const sigma4 = () => w2.X() ** 2 + w2.Y() ** 2

        const deltaPravokotenP0 = deltaPravokoten(p0, p1)
        const deltaPravokotenP1 = deltaPravokoten(p1, p2)
        const deltaPravokotenP2 = deltaPravokoten(p2, p3)
        const deltaPravokotenP3 = deltaPravokoten(p3, p4)
        const deltaPravokotenP4 = deltaPravokoten(p4, p5)


        const ww0 = () => sigma0();
        const ww1 = () => 1 / 9 * (4 * sigma1() + 5 * sigma0())
        const ww2 = () => 1 / 18 * (3 * sigma2() + 10 * sigma1() + 5 * sigma0())
        const ww3 = () => 1 / 42 * (2 * sigma3() + 15 * sigma2() + 20 * sigma1() + 5 * sigma0())
        const ww4 = () => 1 / 126 * (sigma4() + 20 * sigma3() + 60 * sigma2() + 40 * sigma1() + 5 * sigma0())
        const ww5 = () => 1 / 126 * (5 * sigma4() + 40 * sigma3() + 60 * sigma2() + 20 * sigma1() + sigma0())
        const ww6 = () => 1 / 42 * (2 * sigma1() + 15 * sigma2() + 20 * sigma3() + 5 * sigma4())
        const ww7 = () => 1 / 18 * (3 * sigma2() + 10 * sigma3() + 5 * sigma4())
        const ww8 = () => 1 / 9 * (4 * sigma3() + 5 * sigma4())
        const ww9 = () => sigma4();

        const o0 = new PointImpl(
            () => 1 / ww0() * (sigma0() * p0.X() + 5 * this.d * deltaPravokotenP0.X()),
            () => 1 / ww0() * (sigma0() * p0.Y() + 5 * this.d * deltaPravokotenP0.Y()))

        const o1 = new PointImpl(
            () => 1 / (9 * ww1()) * (4 * sigma1() * p0.X() + 5 * sigma0() * p1.X() + 5 * this.d * (5 * deltaPravokotenP0.X() + 4 * deltaPravokotenP1.X())),
            () => 1 / (9 * ww1()) * (4 * sigma1() * p0.Y() + 5 * sigma0() * p1.Y() + 5 * this.d * (5 * deltaPravokotenP0.Y() + 4 * deltaPravokotenP1.Y())))

        const o2 = new PointImpl(
            () => 1 / (18 * ww2()) * (3 * sigma2() * p0.X() + 10 * sigma1() * p1.X() + 5 * sigma0() * p2.X() + 5 * this.d * (5 * deltaPravokotenP0.X() + 10 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (18 * ww2()) * (3 * sigma2() * p0.Y() + 10 * sigma1() * p1.Y() + 5 * sigma0() * p2.Y() + 5 * this.d * (5 * deltaPravokotenP0.Y() + 10 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))

        const o3 = new PointImpl(
            () => 1 / (42 * ww3()) * (2 * sigma3() * p0.X() + 15 * sigma2() * p1.X() + 20 * sigma1() * p2.X() + 5 * sigma0() * p3.X() + 5 * this.d * (5 * deltaPravokotenP0.X() + 20 * deltaPravokotenP1.X() + 15 * deltaPravokotenP2.X() + 2 * deltaPravokotenP3.X())),
            () => 1 / (42 * ww3()) * (2 * sigma3() * p0.Y() + 15 * sigma2() * p1.Y() + 20 * sigma1() * p2.Y() + 5 * sigma0() * p3.Y() + 5 * this.d * (5 * deltaPravokotenP0.Y() + 20 * deltaPravokotenP1.Y() + 15 * deltaPravokotenP2.Y() + 2 * deltaPravokotenP3.Y())))

        const o4 = new PointImpl(
            () => 1 / (126 * ww4()) * (sigma4() * p0.X() + 20 * sigma3() * p1.X() + 60 * sigma2() * p2.X() + 40 * sigma1() * p3.X() + 5 * sigma0() * p4.X() + 5 * this.d * (5 * deltaPravokotenP0.X() + 40 * deltaPravokotenP1.X() + 60 * deltaPravokotenP2.X() + 20 * deltaPravokotenP3.X() + deltaPravokotenP4.X())),
            () => 1 / (126 * ww4()) * (sigma4() * p0.Y() + 20 * sigma3() * p1.Y() + 60 * sigma2() * p2.Y() + 40 * sigma1() * p3.Y() + 5 * sigma0() * p4.Y() + 5 * this.d * (5 * deltaPravokotenP0.Y() + 40 * deltaPravokotenP1.Y() + 60 * deltaPravokotenP2.Y() + 20 * deltaPravokotenP3.Y() + deltaPravokotenP4.Y())))

        const o5 = new PointImpl(
            () => 1 / (126 * ww5()) * (5 * sigma4() * p1.X() + 40 * sigma3() * p2.X() + 60 * sigma2() * p3.X() + 20 * sigma1() * p4.X() + sigma0() * p5.X() + 5 * this.d * (deltaPravokotenP0.X() + 20 * deltaPravokotenP1.X() + 60 * deltaPravokotenP2.X() + 40 * deltaPravokotenP3.X() + 5 * deltaPravokotenP4.X())),
            () => 1 / (126 * ww5()) * (5 * sigma4() * p1.Y() + 40 * sigma3() * p2.Y() + 60 * sigma2() * p3.Y() + 20 * sigma1() * p4.Y() + sigma0() * p5.Y() + 5 * this.d * (deltaPravokotenP0.Y() + 20 * deltaPravokotenP1.Y() + 60 * deltaPravokotenP2.Y() + 40 * deltaPravokotenP3.Y() + 5 * deltaPravokotenP4.Y())))

        const o6 = new PointImpl(
            () => 1 / (42 * ww6()) * (2 * sigma1() * p5.X() + 15 * sigma2() * p4.X() + 20 * sigma3() * p3.X() + 5 * sigma4() * p2.X() + 5 * this.d * (5 * deltaPravokotenP4.X() + 20 * deltaPravokotenP3.X() + 15 * deltaPravokotenP2.X() + 2 * deltaPravokotenP1.X())),
            () => 1 / (42 * ww6()) * (2 * sigma1() * p5.Y() + 15 * sigma2() * p4.Y() + 20 * sigma3() * p3.Y() + 5 * sigma4() * p2.Y() + 5 * this.d * (5 * deltaPravokotenP4.Y() + 20 * deltaPravokotenP3.Y() + 15 * deltaPravokotenP2.Y() + 2 * deltaPravokotenP1.Y())))

        const o7 = new PointImpl(
            () => 1 / (18 * ww7()) * (3 * sigma2() * p5.X() + 10 * sigma3() * p4.X() + 5 * sigma4() * p3.X() + 5 * this.d * (5 * deltaPravokotenP4.X() + 10 * deltaPravokotenP3.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (18 * ww7()) * (3 * sigma2() * p5.Y() + 10 * sigma3() * p4.Y() + 5 * sigma4() * p3.Y() + 5 * this.d * (5 * deltaPravokotenP4.Y() + 10 * deltaPravokotenP3.Y() + 3 * deltaPravokotenP2.Y())))

        const o8 = new PointImpl(
            () => 1 / (9 * ww8()) * (4 * sigma3() * p3.X() + 5 * sigma4() * p4.X() + 5 * this.d * (5 * deltaPravokotenP4.X() + 4 * deltaPravokotenP3.X())),
            () => 1 / (9 * ww8()) * (4 * sigma3() * p3.Y() + 5 * sigma4() * p4.Y() + 5 * this.d * (5 * deltaPravokotenP4.Y() + 4 * deltaPravokotenP3.Y())))

        const o9 = new PointImpl(
            () => 1 / ww9() * (sigma4() * p5.X() + 5 * this.d * deltaPravokotenP4.X()),
            () => 1 / ww9() * (sigma4() * p5.Y() + 5 * this.d * deltaPravokotenP4.Y()))

        return [[o0, o1, o2, o3, o4, o5, o6, o7, o8, o9], [ww0, ww1, ww2, ww3, ww4, ww5, ww6, ww7, ww8, ww9]];
    }

    generatePointsForDegree3(points: Point[]): Point[] {
        const p0 = points[0]
        const w0 = this.w[0]
        const w1 = this.w[1]

        const bp0 = p0
        const bp1 = new PointImpl(() => bp0.X() + 1 / 3 * (w0.X() ** 2 - w0.Y() ** 2),
            () => bp0.Y() + 2 / 3 * w0.X() * w0.Y())
        const bp2 = new PointImpl(() => bp1.X() + 1 / 3 * (w0.X() * w1.X() - w0.Y() * w1.Y()),
            () => bp1.Y() + 1 / 3 * (w0.X() * w1.Y() + w0.Y() * w1.X()))
        const bp3 = new PointImpl(() => bp2.X() + 1 / 3 * (w1.X() ** 2 - w1.Y() ** 2),
            () => bp2.Y() + 2 / 3 * w1.X() * w1.Y())
        return [bp0, bp1, bp2, bp3];
    }

    generatePointsForDegree5(points: Array<Point>) {
        const p0 = points[0]
        const w0 = points[1]
        const w1 = points[2]
        const w2 = points[3]

        const bp0 = p0
        const bp1 = new PointImpl(() => bp0.X() + 1 / 5 * (w0.X() ** 2 - w0.Y() ** 2),
            () => bp0.Y() + 2 / 5 * w0.X() * w0.Y())
        const bp2 = new PointImpl(() => bp1.X() + 1 / 5 * (w0.X() * w1.X() - w0.Y() * w1.Y()),
            () => bp1.Y() + 1 / 5 * (w0.X() * w1.Y() + w0.Y() * w1.X()))
        const bp3 = new PointImpl(() => bp2.X() + 1 / 15 * (2 * (w1.X() ** 2 - w1.Y() ** 2) + (w0.X() * w2.X() - w0.Y() * w2.Y())),
            () => bp2.Y() + 1 / 15 * (4 * w1.X() * w1.Y() + (w0.X() * w2.Y() + w0.Y() * w2.X())))
        const bp4 = new PointImpl(() => bp3.X() + 1 / 5 * (w1.X() * w2.X() - w1.Y() * w2.Y()),
            () => bp3.Y() + 1 / 5 * (w1.X() * w2.Y() + w1.Y() * w2.X()))
        const bp5 = new PointImpl(() => bp4.X() + 1 / 5 * (w2.X() ** 2 - w2.Y() ** 2),
            () => bp4.Y() + 2 / 5 * w2.X() * w2.Y())
        return [bp0, bp1, bp2, bp3, bp4, bp5];
    }

    generatePointsForUnderlyingBezierCurve(points: Array<Point>) {
        if (this.degree === 3) {
            return this.generatePointsForDegree3(points)
        } else if (this.degree === 4) {
            return this.generatePointsForDegree5(points)
        }
        throw "Invalid points length. Must be of length 3 or 4."
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
        this.w.forEach(point => this.transformPoint(point, 0, 0, rotationMatrix, undefined))
        this.underlyingBezierCurve.rotate(theta);
    }

    elevate(): BezierCurve {
        return this.underlyingBezierCurve.elevate();
    }

    decasteljauScheme(t: number): Point[][] {
        return this.underlyingBezierCurve.decasteljauScheme(t);
    }

    scale(xScale: number) {
        this.points.forEach(point => this.transformPoint(point, 0, 0, [[xScale, 0], [0, xScale]], undefined))
        console.log(this.points)
        this.w.forEach(point => this.transformPoint(point, 0, 0, [[xScale, 0], [0, xScale]], undefined))
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