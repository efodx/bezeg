import React, {Component} from 'react';
import './App.css';

import {JSXGraph} from "jsxgraph";
import {Point} from "jsxgraph";
import {Point as PoPoint} from "./point";
import {BezierCurve} from "./bezier-curve";

class Graph extends Component<any, any> {

    componentDidMount() {
        const board = JSXGraph.initBoard("jgbox", {boundingbox: [-5, 5, 5, -5], axis: true});
        const p = board.create('point', [-1, 2]);
        const pp = new PointWrap(p);
        const p2 = board.create('point', [0, 1]);
        const pp2 = new PointWrap(p2);
        const p3 = board.create('point', [1,1]);
        const pp3 = new PointWrap(p3);
        const p4 = board.create('point', [2,0]);
        const pp4 = new PointWrap(p4);

        const bejzjer = new BezierCurve([pp,pp2,pp3,pp4])

        var curve = board.create('curve',
            [function(t: number){ return bejzjer.calculatePointAtT(t).X();},
                function(t: number){ return bejzjer.calculatePointAtT(t).Y();},
                0,1]
        );
    }

    render() {
        return <div id="jgbox" style={{width: 500, height: 500, background: "white"}}></div>;
    }
}

class PointWrap implements  PoPoint{
    private point: Point;
    constructor(point:Point){
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

export default Graph;
