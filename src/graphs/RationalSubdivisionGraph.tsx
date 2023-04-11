import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {JGBox} from "../JGBox";
import BaseGraph from "./BaseGraph";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";

class Graph extends BaseGraph {
    private bezierCurves: RationalBezierCurve[] = [];
    private jxgCurves: JXG.Curve[] = [];
    private slider: JXG.Slider | undefined;
    private stepsDone: number = 0;

    initialize() {
        // TODO find out what fills out the bezier curves array before this, somehow 2 curves end up in it instead of one
        this.bezierCurves = []
        const p = this.createJSXGraphPoint(-3, 2);
        const p2 = this.createJSXGraphPoint(0, -2);
        const p3 = this.createJSXGraphPoint(1, 2);
        const p4 = this.createJSXGraphPoint(2, -1);
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [0, 0.5, 1]]);
        this.bezierCurves.push(new RationalBezierCurve([p, p2, p3, p4], [1, 10, 1, 1]))
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

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        // @ts-ignore
        this.board.removeObject(this.points.concat(this.jxgCurves))
        const newBezierCurves = []
        for (let bezierCurve of this.bezierCurves) {
            // TODO Think of how to handle this, we would still like to add new curves, but the process takes shitloads of time
            //  The removing and drawing objects step is the slow one, so try to modify that to use existing objects
            // Maybe draw the points somewhere offscreen on initialize and then modify them instead of creating new
            // Use spinner for initialization
            const [curve1, curve2]: RationalBezierCurve[] = bezierCurve.subdivide(this.slider!.Value());

            curve1.setPoints(curve1.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y())))
            curve2.setPoints(curve2.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y())))

            newBezierCurves.push(curve1)
            newBezierCurves.push(curve2)

            const jxgCurve1 = this.board.create('curve',
                [(t: number) => curve1.calculatePointAtT(t).X(),
                    (t: number) => curve1.calculatePointAtT(t).Y(),
                    0, 1],
                {
                    "numberPointsHigh": 4,
                    "numberPointsLow": 4
                }
            )
            // @ts-ignore
            this.jxgCurves.push(jxgCurve1)
            const jxgCurve2 = this.board.create('curve',
                [(t: number) => curve2.calculatePointAtT(t).X(),
                    (t: number) => curve2.calculatePointAtT(t).Y(),
                    0, 1],
                {
                    "numberPointsHigh": 4,
                    "numberPointsLow": 4
                }
            )
            // @ts-ignore
            this.jxgCurves.push(jxgCurve2)
        }
        this.bezierCurves = newBezierCurves;
    };

}

export default Graph;
