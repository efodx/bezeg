import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";

class Graph extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {
    initialize() {
        this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
    }

    elevate() {
        this.board.suspendUpdate()
        this.getFirstJsxCurve().elevate()
        this.board.unsuspendUpdate()
    }

    getGraphCommands(): JSX.Element[] {
        return [<Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>]
    }
}

export default Graph;
