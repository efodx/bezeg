import {Point as BezegPoint} from "../bezeg/point/point";
import {Point as JSXPoint} from "jsxgraph";

/**
 * Class that wraps a JSXPoint into BezegPoint interface.
 */
export class Point implements BezegPoint{
    private point: JSXPoint;
    constructor(point:JSXPoint){
        this.point = point;
    }

    X(): number {
        return this.point.X();
    }

    Y(): number {
        return this.point.Y();
    }

    setX(x: number): void {
        throw new Error("Cannot set values to JSXPoints.")
    }

    setY(y: number): void {
        throw new Error("Cannot set values to JSXPoints.")
    }
}