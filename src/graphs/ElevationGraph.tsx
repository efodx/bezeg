import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph} from "./BaseCurveGraph";

class ElevationGraph extends BaseCurveGraph {
    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
    }

    elevate() {
        this.board.suspendUpdate()
        this.jsxBezierCurves[0].elevate()
        this.board.unsuspendUpdate()
    }

    protected getAdditionalCommands(): JSX.Element {
        return <Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>;
    }
}

export default ElevationGraph;
