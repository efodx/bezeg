import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph} from "./BaseCurveGraph";

class Graph extends BaseCurveGraph {
    private slider: JXG.Slider | undefined;
    private stepsDone: number = 0;

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        this.createJSXBezierCurve(points)
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [0, 0.5, 1]]);
        // this.createJSXGraphPoint(() => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).X(), () => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).Y());
    }

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        // @ts-ignore
        this.board.suspendUpdate()
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c)
        for (let bezierCurve of oldJsxBezierCurves) {
            let newCurve = bezierCurve.subdivide(this.slider!.Value())
            this.jsxBezierCurves.push(newCurve);
        }
        this.board.unsuspendUpdate()
    };

    protected getAdditionalCommands(): JSX.Element {
        return <Button text="Subdiviziraj" onClick={() => this.subdivide()}></Button>
    }

}

export default Graph;
