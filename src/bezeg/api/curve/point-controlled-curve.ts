import {Point} from "../point/point";

export interface PointControlledCurve {

    eval(t: number): Point;

    /**
     * Sets the control points.
     * @param {Array.<Point>} points
     */
    setPoints(points: Point[]): void;

    getPoints(): Point[];

    scale(xScale: number): void;

    scale(xScale: number, yScale: number): void;

    scale(xScale: number, yScale?: number): void;

    moveFor(x: number, y: number): void;

    flip(x: boolean, y: boolean): void;

    /**
     * Rotates the curve around origin by theta.
     * @param theta angle of rotation in radians
     */
    rotate(theta: number): void;

    getBoundingBox(): number[];

    getBoundingBoxCenter(): number[];

    transform(A: number[][], b?: number[], center?: number[]): void;

    transformPoint(point: Point, xCenter: number, yCenter: number, A: number[][], b?: number[]): void;

    /**
     * Removes control point with id. If id doesn't exist, nothing gets removed.
     * @param point
     */
    removePoint(point: Point): void;

    /**
     * Adds a control point to the end of this Curve.
     * @param {Point} point
     */
    addPoint(point: Point): void;

    getConvexHull(): Point[];
}