import {Point} from "./point";

export class PointImpl implements  Point{
    private  x: number;
    private  y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    X(): number {
        return this.x;
    }
    Y(): number {
        return this.y;
    }
    setX(x:number){
        this.x = x;
    }
    setY(y:number){
        this.y = y;
    }

}