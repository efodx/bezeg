import React, {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {BezierCurve} from "../bezeg/bezier-curve";
import {Point} from "./Point";
import {PointImpl} from "../bezeg/point/point-impl";
import {Button} from "../inputs/Button";
import {JGBox} from "../JGBox";
import GraphBase from "./GraphBase";

class Graph extends GraphBase {
    private bezierCurves: BezierCurve[] = [];
    private doneAlready = false;
    private jxgCurves: JXG.Curve[] = [];
    private slider: JXG.Slider | undefined;
    private stepsDone: number = 0;

    initialize() {
        const p =  this.createJSXGraphPoint(-3, 2);
        const p2 = this.createJSXGraphPoint(0, -2);
        const p3 =  this.createJSXGraphPoint(1, 2);
        const p4 =  this.createJSXGraphPoint(3, -2);
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [0, 0.5, 1]]);
        this.bezierCurves.push(new BezierCurve([p, p2, p3, p4]))
        this.createJSXGraphPoint(() => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).X(), () => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).Y());

        this.jxgCurves.push(this.board.create('curve',
            [(t: number) => this.bezierCurves[0].calculatePointAtT(t).X(),
                (t: number) => this.bezierCurves[0].calculatePointAtT(t).Y(),
                0, 1]
        ));
    }

    render() {
        return <div>
            <JGBox/>
            <Button text="Subdiviziraj" onClick={() => this.subdivide()}></Button>
        </div>
    }


    getMouseCoords(e: unknown, i: number | undefined) {

        // @ts-ignore
        const pos = this.board.getMousePosition(e, i);

        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);

    }

    subdivide() {
        if (this.stepsDone > 5) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        // @ts-ignore
        this.board?.removeObject(this.points)// ?.concat(this.jxgCurves)
        const newBezierCurves = []
        for(let bezierCurve of this.bezierCurves){
            // @ts-ignore
            const [curve1, curve2]:BezierCurve[] = bezierCurve.subdivide(this.slider!.Value());

            curve1.setPoints(curve1.getPoints().map(point=>this.createJSXGraphPoint(point.X(),point.Y())))
            curve2.setPoints(curve2.getPoints().map(point=>this.createJSXGraphPoint(point.X(),point.Y())))

            newBezierCurves.push(curve1)
            newBezierCurves.push(curve2)

            // Think of how to handle this, we would still like to add new curves, but the process takes shitloads of time

            // this.jxgCurves.push(this.board.create('curve',
            //     [(t: number) => curve1.calculatePointAtT(t).X(),
            //         (t: number) =>  curve1.calculatePointAtT(t).Y(),
            //         0, 1]
            // ))
            // this.jxgCurves.push(this.board.create('curve',
            //     [(t: number) => curve2.calculatePointAtT(t).X(),
            //         (t: number) => curve2.calculatePointAtT(t).Y(),
            //         0, 1]
            // ))
        }
        this.bezierCurves = newBezierCurves;
    };

}

export default Graph;
