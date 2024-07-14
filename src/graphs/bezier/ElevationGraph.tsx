import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";

class ElevationGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {

    defaultPreset(): string {
        return '["JSXBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]]}","JSXBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]]}"]'
    }
    
    elevate() {
        this.board.suspendUpdate()
        this.getFirstJsxCurve().elevate()
        this.unsuspendBoardUpdate()
    }

    override presets(): string {
        return "elevation-graph"
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"} onClick={() => this.elevate()}>Dvigni
            stopnjo</Button>])
    }
}

export default ElevationGraph;
