import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";
import {BaseGraphStates} from "../base/BaseCurveGraph";

class Graph extends BaseRationalCurveGraph<any, BaseGraphStates> {
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
        return super.getGraphCommands().concat([<Button
            onClick={() => this.subdivide()}>Subdiviziraj</Button>])
    }

    defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "weights": [1, 5, 1, 1], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "subdivisionT": 0.5,
                "extrapolationT": 1.2,
                "showingWeights": false,
                "weightNumber": 1,
                "showingFarinPoints": false
            }
        }]];
    }

    override presets(): string {
        return "rational-bezier-subdivision"
    }


}

export default Graph;
