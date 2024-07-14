import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";

class Graph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {
    private stepsDone: number = 0;

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        this.board.suspendUpdate()
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c as JSXRationalBezierCurve)
        for (let bezierCurve of oldJsxBezierCurves) {
            const newCurve = bezierCurve.subdivide(1 / 2)
            this.jsxBezierCurves.push(newCurve)
        }
        this.unsuspendBoardUpdate()
    };

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.subdivide()}>Subdiviziraj</Button>])
    }

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,5,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier-subdivision"
    }


}

export default Graph;
