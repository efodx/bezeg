import {Point} from "../../api/point/point";

import {CacheContext} from "../../../graphs/context/CacheContext";

export class FixedPoint implements Point {
    private readonly coords: () => [number, number];
    private cachedCoords: undefined | [number, number] = undefined;
    private lastCacheContext = CacheContext.context;

    constructor(generatingFunction: () => [number, number]) {
        this.coords = generatingFunction;
    }

    X(): number {
        return this.getCoords()[0];
    }

    Y(): number {
        return this.getCoords()[1];
    }

    setX(x: number | (() => number)) {
        throw "JUST DONT DO THIS BROTHER PLS";
    }

    setY(y: number | (() => number)) {
        throw "JUST DONT DO THIS BROTHER PLS";
    }

    isXFunction(): boolean {
        return true;
    }

    isYFunction(): boolean {
        return true;
    }

    private getCoords() {
        const currentContext = CacheContext.context;
        if (!this.cachedCoords || currentContext !== this.lastCacheContext) {
            this.cachedCoords = this.coords();
            this.lastCacheContext = currentContext;
        }
        return this.cachedCoords;
    }

}