import {Point} from "../point/point";
import {PointControlledCurve} from "./point-controlled-curve";

export interface BezierCurve extends PointControlledCurve {
    elevate(): BezierCurve;

    /**
     * Returns the full decasteljau scheme for desired t.
     * @param t
     */
    decasteljauScheme(t: number): Point[][];

    /**
     * Returns a new bezier curve that is the extrapolated version of the current one.
     * @param t
     */
    extrapolate(t: number): BezierCurve;

    /**
     * Returns two bezier curves that together form the current one.
     * @param t
     */
    subdivide(t: number): BezierCurve[];

    decasteljau(t: number, pointsAtT: number[][]): number[][][];
}