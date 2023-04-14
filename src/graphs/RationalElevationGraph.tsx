import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";

class Graph extends BaseRationalCurveGraph {
    initialize() {
        this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
    }

    elevate() {
        this.board.suspendUpdate()
        this.jsxBezierCurves[0].elevate()
        this.board.unsuspendUpdate()
    }

    protected getAdditionalCommands(): JSX.Element {
        return <Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>
    }
}

export default Graph;
