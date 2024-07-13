import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";

class Graph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {
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
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c as JSXRationalBezierCurve)
        for (let bezierCurve of oldJsxBezierCurves) {
            bezierCurve.subdivide(this.slider!.Value())
        }
        this.unsuspendBoardUpdate()
    };

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.subdivide()}>Subdiviziraj</Button>])
    }

}

export default Graph;
