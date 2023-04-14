import React from 'react';
import '../App.css';
import {BaseCurveGraph} from "./BaseCurveGraph";

class BezierCurveGraph extends BaseCurveGraph {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }

    protected getAdditionalCommands(): JSX.Element {
        return <div></div>;
    }
}

export default BezierCurveGraph;
