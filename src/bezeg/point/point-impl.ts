import {Point} from "./point";

export class PointImpl implements Point {
    private x: number | (() => number);
    private y: number | (() => number);

    constructor(x: number | (() => number), y: number | (() => number)) {
        this.x = x;
        this.y = y;
    }

    X(): number {
        if (typeof this.x == 'number') {
            return this.x;
        }
        return this.x()
    }

    Y(): number {
        if (typeof this.y == 'number') {
            return this.y;
        }
        return this.y()
    }

    setX(x: number | (() => number)) {
        this.x = x;
    }

    setY(y: number | (() => number)) {
        this.y = y;
    }

}