import {Point} from "./point";

export interface PointControlledCurve {

    calculatePointAtT(t: number): Point;

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

    affineTransform(A: number [][]): void;

    affineTransform(A: number [][], b?: number[]): void;

    affineTransform(A: number[][], b?: number[], center?: number[]): void;

    transformPoint(point: Point, xCenter: number, yCenter: number, A: number[][], b: number[] | undefined): void;

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
}