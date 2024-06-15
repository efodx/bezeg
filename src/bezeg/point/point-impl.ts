import {Point} from "../interfaces/point";
import {CacheContext} from "../../Contexts";

export class PointImpl implements Point {
    private x: number | (() => number);
    private y: number | (() => number);
    private lastCacheContextX = CacheContext.context
    private cachedX?: number = undefined
    private cachedY?: number = undefined
    private lastCacheContextY: number = CacheContext.context;

    constructor(x: number | (() => number), y: number | (() => number)) {
        this.x = x;
        this.y = y;
    }

    X(): number {
        if (typeof this.x == 'number') {
            return this.x;
        }
        const currentContext = CacheContext.context
        if (!this.cachedX || currentContext !== this.lastCacheContextX) {
            this.cachedX = this.x()
            this.lastCacheContextX = currentContext
        }
        return this.cachedX!
    }

    Y(): number {
        if (typeof this.y == 'number') {
            return this.y;
        }
        const currentContext = CacheContext.context
        if (!this.cachedY || CacheContext.context !== this.lastCacheContextY) {
            this.cachedY = this.y()
            this.lastCacheContextY = currentContext
        }
        return this.cachedY!
    }

    setX(x: number | (() => number)) {
        this.x = x;
    }

    setY(y: number | (() => number)) {
        this.y = y;
    }

    isXFunction(): boolean {
        return typeof this.x === "function"
    }

    isYFunction(): boolean {
        return typeof this.y === "function"
    }

}