import {Point as BezegPoint} from "../bezeg/point/point";
import {Point as JSXPoint} from "jsxgraph";

export class Point implements  BezegPoint{
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

    setX(arg0: number): void {
    }

    setY(arg0: number): void {
    }
}