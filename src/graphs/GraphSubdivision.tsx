import React, {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {BezierCurve} from "../bezeg/bezier-curve";
import {Point} from "./Point";
import {PointImpl} from "../bezeg/point/point-impl";

class Graph extends Component<any, any> {
    private board: Board | undefined;
    private points: JXG.Point[] | undefined;
    private bejzjer: BezierCurve | undefined;
    private doneAlready = false;
    private curve: JXG.Curve | undefined;

    componentDidMount() {
        this.board = JSXGraph.initBoard("jgboxxie", {boundingbox: [-5, 5, 5, -5], axis: true});
        const p = this.board.create('point', [-3, 2]);
        const pp = new Point(p);
        const p2 = this.board.create('point', [0, -2]);
        const pp2 = new Point(p2);
        const p3 = this.board.create('point', [1,2]);
        const pp3 = new Point(p3);
        const p4 = this.board.create('point', [3,-2 ]);
        const pp4 = new Point(p4);
        this.points = [p,p2,p3,p4]
        this.bejzjer = new BezierCurve([pp,pp2,pp3,pp4])

        this.curve = this.board.create('curve',
            [(t: number) => {
                // @ts-ignore
                return this.bejzjer.calculatePointAtT(t).X();
            },
                (t: number) => {
                    // @ts-ignore
                    return this.bejzjer.calculatePointAtT(t).Y();
                },
                0, 1]
        );
        this.board.on('down',(e) => this.handleDown(e));
    }

    render() {
        return <div id="jgboxxie" style={{width: 500, height: 500, background: "white"}}></div>;
    }



     getMouseCoords(e: unknown, i: number | undefined) {

        // @ts-ignore
         const pos = this.board.getMousePosition(e, i);

         return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);

    }



    handleDown (e: unknown) {
        if(this.doneAlready){
            return
        }
        // @ts-ignore
        const decasteljauScheme = this.bejzjer.decasteljau(0.5)
        const n = decasteljauScheme.length
        const points1 = decasteljauScheme.map((row, i) => row[0]).map(point =>  this.createJSXGraphPoint(point.X(), point.Y()))
        const points2 = decasteljauScheme.map((row, i) => row[n - 1 - i]).map(point => this.createJSXGraphPoint(point.X(), point.Y())).reverse()
        const bezierCurve1 = new BezierCurve(points1)
        const bezierCurve2 = new BezierCurve(points2)
        this.doneAlready=true;
        // @ts-ignore
        // @ts-ignore
        this.board?.removeObject(this.points?.concat(this.curve))



        // @ts-ignore
        this.curve = this.board.create('curve',
            [(t: number) => {
                // @ts-ignore
                return bezierCurve1.calculatePointAtT(t).X();
            },
                (t: number) => {
                    // @ts-ignore
                    return bezierCurve1.calculatePointAtT(t).Y();
                },
                0, 1]
        );

        // @ts-ignore
        this.curve = this.board.create('curve',
            [(t: number) => {
                // @ts-ignore
                return bezierCurve2.calculatePointAtT(t).X();
            },
                (t: number) => {
                    // @ts-ignore
                    return bezierCurve2.calculatePointAtT(t).Y();
                },
                0, 1]
        );
    };

    createJSXGraphPoint(x: unknown, y: unknown){
        // @ts-ignore
        return new Point(this.board.create('point', [x, y]));
    }



}

export default Graph;
