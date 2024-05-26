import React from 'react';
import '../../App.css';
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";

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
        return super.getGraphCommands().concat([<Button variant={"dark"} onClick={() => this.elevate()}>Dvigni
            stopnjo</Button>]
        )
    }
}

export default Graph;
