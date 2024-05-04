import {Point} from "./interfaces/point";
import {PointImpl} from "./point/point-impl";
import {BezierCurve} from "./interfaces/bezier-curve";
import {BezierCurveImpl} from "./bezier-curve-impl";


/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 * There are just certain restrictions.
 */
export class PhBezierCurve implements BezierCurve {
    private degree: number
    private underlyingBezierCurve: BezierCurve;
    private points: Point[]

    constructor(points: Point[]) {
        this.underlyingBezierCurve = new BezierCurveImpl(this.generatePointsForUnderlyingBezierCurve(points))
        this.degree = points.length
        this.points = points
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
        this.underlyingBezierCurve.rotate(theta);
    }

    elevate(): BezierCurve {
        return this.underlyingBezierCurve.elevate();
    }

    decasteljauScheme(t: number): Point[][] {
        return this.underlyingBezierCurve.decasteljauScheme(t);
    }

    scale(xScale: number) {
        this.underlyingBezierCurve.scale(xScale);
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