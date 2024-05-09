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

    constructor(points: Point[]) {
        this.points = points
        this.underlyingCurveControlPoints = this.generatePointsForUnderlyingBezierCurve(points)
        this.underlyingBezierCurve = new BezierCurveImpl(this.underlyingCurveControlPoints)
        let [rpoints, rweights] = this.generatePointsForOffsetCurve(points)
        this.offsetCurve = new RationalBezierCurve(rpoints, rweights)
        this.degree = points.length
    }

    getOffsetCurve() {
        return this.offsetCurve
    }

    setOffsetCurveDistance(d: number) {
        this.d = d
    }

    generatePointsForOffsetCurve(points: Array<Point>) {
        const degree = points.length
        if (degree == 3) {
            return this.generateOffsetCurvePointsForDegree3(points)
        } else if (degree == 4) {
            //return this.generateOffsetPointsForDegree5(points)
        }
        throw "Invalid points length. Must be of length 3 or 4."
    }

    generateOffsetCurvePointsForDegree3(points: Point[]): [Point[], Array<() => number>] {
        const w0 = points[1]
        const w1 = points[2]

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

        const o0 = new PointImpl(() => 1 / ww0() * (sigma0() * p0.X() + 3 * this.d * deltaPravokotenP0.X()),
            () => 1 / ww0() * (sigma0() * p0.Y() + 3 * this.d * deltaPravokotenP0.Y()))
        const o1 = new PointImpl(() => 1 / (5 * ww1()) * (2 * sigma1() * p0.X() + 3 * sigma0() * p1.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 2 * deltaPravokotenP1.X())),
            () => 1 / (5 * ww1()) * (2 * sigma1() * p0.Y() + 3 * sigma0() * p1.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 2 * deltaPravokotenP1.Y())))
        const o2 = new PointImpl(() => 1 / (10 * ww2()) * (sigma2() * p0.X() + 6 * sigma1() * p1.X() + 3 * sigma0() * p2.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + deltaPravokotenP2.X())),
            () => 1 / (10 * ww2()) * (sigma2() * p0.Y() + 6 * sigma1() * p1.Y() + 3 * sigma0() * p2.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + deltaPravokotenP2.Y())))
        const o3 = new PointImpl(() => 1 / (10 * ww3()) * (3 * sigma2() * p1.X() + 6 * sigma1() * p2.X() + sigma0() * p3.X() + 3 * this.d * (deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (10 * ww3()) * (3 * sigma2() * p1.Y() + 6 * sigma1() * p2.Y() + sigma0() * p3.Y() + 3 * this.d * (deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        const o4 = new PointImpl(() => 1 / (5 * ww4()) * (3 * sigma2() * p2.X() + 2 * sigma1() * p3.X() + 3 * this.d * (2 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
            () => 1 / (5 * ww4()) * (3 * sigma2() * p2.Y() + 2 * sigma1() * p3.Y() + 3 * this.d * (2 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        const o5 = new PointImpl(() => 1 / ww5() * (sigma2() * p3.X() + 3 * this.d * deltaPravokotenP2.X()),
            () => 1 / ww5() * (sigma2() * p3.Y() + 3 * this.d * deltaPravokotenP2.Y()))

        // const o0 = new PointImpl(() => 1 / sigma0() * (sigma0() * p0.X() + 3 * this.d * deltaPravokotenP0.X()),
        //     () => 1 / sigma0() * (sigma0() * p0.Y() + 3 * this.d * deltaPravokotenP0.Y()))
        // const o1 = new PointImpl(() => 1 / (5 * (2 * sigma1() + 3 * sigma0())) * (2 * sigma1() * p0.X() + 3 * sigma0() * p1.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 2 * deltaPravokotenP1.X())),
        //     () => 1 / (5 * (2 * sigma1() + 3 * sigma0())) * (2 * sigma1() * p0.Y() + 3 * sigma0() * p1.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 2 * deltaPravokotenP1.Y())))
        // const o2 = new PointImpl(() => 1 / (10 * (sigma2() + 6 * sigma1() + 3 * sigma0())) * (sigma2() * p0.X() + 6 * sigma1() * p1.X() + 3 * sigma0() * p2.X() + 3 * this.d * (3 * deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + deltaPravokotenP2.X())),
        //     () => 1 / (10 * (sigma2() + 6 * sigma1() + 3 * sigma0())) * (sigma2() * p0.Y() + 6 * sigma1() * p1.Y() + 3 * sigma0() * p2.Y() + 3 * this.d * (3 * deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + deltaPravokotenP2.Y())))
        // const o3 = new PointImpl(() => 1 / (10 * (3 * sigma2() + 6 * sigma1() + sigma0())) * (3 * sigma2() * p1.X() + 6 * sigma1() * p2.X() + sigma0() * p3.X() + 3 * this.d * (deltaPravokotenP0.X() + 6 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
        //     () => 1 / (10 * (3 * sigma2() + 6 * sigma1() + sigma0())) * (3 * sigma2() * p1.Y() + 6 * sigma1() * p2.Y() + sigma0() * p3.Y() + 3 * this.d * (deltaPravokotenP0.Y() + 6 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        // const o4 = new PointImpl(() => 1 / (5 * (3 * sigma2() + 2 * sigma1())) * (3 * sigma2() * p2.X() + 2 * sigma1() * p3.X() + 3 * this.d * (2 * deltaPravokotenP1.X() + 3 * deltaPravokotenP2.X())),
        //     () => 1 / (5 * (3 * sigma2() + 2 * sigma1())) * (3 * sigma2() * p2.Y() + 2 * sigma1() * p3.Y() + 3 * this.d * (2 * deltaPravokotenP1.Y() + 3 * deltaPravokotenP2.Y())))
        // const o5 = new PointImpl(() => 1 / sigma2() * (sigma2() * p3.X() + 3 * this.d * deltaPravokotenP2.X()),
        //     () => 1 / sigma2() * (sigma2() * p3.Y() + 3 * this.d * deltaPravokotenP2.Y()))
        //

        return [[o0, o1, o2, o3, o4, o5], [ww0, ww1, ww2, ww3, ww4, ww5]];
    }

    generateOffsetPointsForDegree5(points: Array<Point>) {
        const p0 = points[0]
        const w0 = points[1]
        const w1 = points[2]
        const w2 = points[3]

        // we make these functions, so that they are automatically updated if w0,w1,w2 are moved
        const sigma0 = () => w0.X() ** 2 + w0.Y() ** 2
        const sigma1 = () => w0.X() * w1.X() + w0.Y() * w1.Y()
        const sigma2 = () => 2 / 3 * (w1.X() ** 2 + w1.Y() ** 2) + 1 / 3 * (w0.X() * w2.X() + w0.Y() * w2.Y())
        const sigma3 = () => w1.X() * w2.X() + w1.Y() * w2.Y()
        const sigma4 = () => w2.X() ** 2 + w2.Y() ** 2

        const o0 = new PointImpl(() => 2,
            () => 3)
        const o1 = 1
        const o2 = 1
        const o3 = 1
        const o4 = 1

        return [];
    }

    generatePointsForDegree3(points: Point[]): Point[] {
        const p0 = points[0]
        const w0 = points[1]
        const w1 = points[2]

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
        const degree = points.length
        if (degree == 3) {
            return this.generatePointsForDegree3(points)
        } else if (degree == 4) {
            // why quintics degree only have 4 free points?
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
        let hodographPoints = this.points.slice(1)
        const rotationMatrix = [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]
        this.affineTransform(rotationMatrix)
        hodographPoints.forEach(point => this.transformPoint(point, 0, 0, rotationMatrix, undefined))
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