import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Attributes} from "../attributes/Attributes";

class Graph extends BaseRationalCurveGraph<any, BaseGraphStates> {

    override initialize() {
        super.initialize();
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
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

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,5,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier-elevation"
    }
}

export default Graph;
