import React from 'react';

import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {Attributes} from "../attributes/Attributes";

class ElevationGraph extends BaseBezierCurveGraph<any, BaseGraphStates> {
    override initialize() {
        super.initialize();
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
    }

    defaultPreset(): any {
        return [["JSXBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2
            }
        }]]
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
        return super.getGraphCommands().concat([<Button onClick={() => this.elevate()}>Dvigni
            stopnjo</Button>])
    }
}

export default ElevationGraph;
