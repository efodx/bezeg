import {Point as BezegPoint} from "../bezeg/point/point";
import {Point as JSXPoint} from "jsxgraph";

/**
 * Class that wraps a JSXPoint into BezegPoint interface.
 */
export class Point implements BezegPoint {
    private point: JSXPoint;

    constructor(point: JSXPoint) {
        this.point = point;
    }

    X(): number {
        return this.point.X();
    }

    Y(): number {
        return this.point.Y();
    }

    setX(x: number): void {
        // this.point.moveTo([x, this.point.Y()])
        this.point.setPositionDirectly(JXG.COORDS_BY_USER, [x, this.point.Y()]);
    }

    setY(y: number): void {
        //this.point.moveTo([this.point.X(), y])
        this.point.setPositionDirectly(JXG.COORDS_BY_USER, [this.point.X(), y]);
    }
}