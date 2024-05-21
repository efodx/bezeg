import React from 'react';
import '../../App.css';
import {Button} from "../../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";

class ElevationGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
    }

    elevate() {
        this.board.suspendUpdate()
        this.getFirstJsxCurve().elevate()
        this.board.unsuspendUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>])
    }
}

export default ElevationGraph;
