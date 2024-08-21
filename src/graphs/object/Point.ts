import {Point as BezegPoint} from "../../bezeg/api/point/point";
import {Point as JSXPoint} from "jsxgraph";

/**
 * Class that wraps a JSXPoint into BezegPoint interface.
 */
export class Point implements BezegPoint {
    readonly point: JSXPoint;

    constructor(point: JSXPoint) {
        this.point = point;
    }

    X(): number {
        return this.point.X();
    }

    Y(): number {
        return this.point.Y();
    }

    setX(x: number | (() => number)): void {
        if (typeof x == 'function') {
            // eslint-disable-next-line no-throw-literal
            throw "Not implemented yet";
        }
        this.point.setPositionDirectly(JXG.COORDS_BY_USER, [x, this.point.Y()]);
    }

    setY(y: number | (() => number)): void {
        if (typeof y == 'function') {
            // eslint-disable-next-line no-throw-literal
            throw "Not implemented yet";
        }
        this.point.setPositionDirectly(JXG.COORDS_BY_USER, [this.point.X(), y]);
    }

    isXFunction(): boolean {
        return false;
    }

    isYFunction(): boolean {
        return false;
    }
}