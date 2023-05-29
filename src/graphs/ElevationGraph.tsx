import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";

class ElevationGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
    }

    elevate() {
        this.board.suspendUpdate()
        this.getFirstJsxCurve().elevate()
        this.board.unsuspendUpdate()
    }

    getGraphCommands(): JSX.Element[] {
        return [<Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>];
    }
}

export default ElevationGraph;
