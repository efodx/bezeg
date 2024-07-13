import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";

class Graph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {
    initialize() {
        this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
    }

    elevate() {
        this.board.suspendUpdate()
        this.getFirstJsxCurve().elevate()
        this.unsuspendBoardUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"} onClick={() => this.elevate()}>Dvigni
            stopnjo</Button>]
        )
    }
}

export default Graph;
