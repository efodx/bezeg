import React from 'react';
import '../../App.css';
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";

class Graph extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {
    private slider?: JXG.Slider;
    private stepsDone: number = 0;

    initialize() {
        this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [0, 0.5, 1]]);
        //this.createJSXGraphPoint(() => curve.getBezierCurve().calculatePointAtT(this.slider!.Value()).X(), () => curve.getBezierCurve().calculatePointAtT(this.slider!.Value()).Y());
    }

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        this.board.suspendUpdate()
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c)
        for (let bezierCurve of oldJsxBezierCurves) {
            let newCurve = bezierCurve.subdivide(this.slider!.Value())
            this.jsxBezierCurves.push(newCurve);
        }
        this.unsuspendBoardUpdate()
    };

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.subdivide()}>Subdiviziraj</Button>])
    }

}

export default Graph;
