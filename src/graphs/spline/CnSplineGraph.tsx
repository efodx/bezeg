import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {JSXGenericSplineCurve} from "../object/JSXGenericSplineCurve";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override presets(): string {
        return "cn-spline";
    }

    defaultPreset(): any {
        return [["JSXGenericSplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]],
            "degree": 2,
            "continuity": 0,
            "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<div><Button onClick={() => this.increaseContinuity()}>Zvisaj
            zveznost</Button><Button onClick={() => this.decreaseContinuity()}>Znizaj
            zveznost</Button></div>,
            <div><Button onClick={() => this.increaseDegree()}>Zvisaj
                stopnjo</Button><Button onClick={() => this.decreaseDegree()}>Znizaj
                stopnjo</Button></div>]);
    }

    override getFirstJsxCurve(): JSXGenericSplineCurve {
        return super.getFirstJsxCurve() as JSXGenericSplineCurve;
    }

    private increaseContinuity() {
        this.board.suspendUpdate();
        this.getFirstJsxCurve().increaseContinuity();
        this.unsuspendBoardUpdate();
    }

    private decreaseContinuity() {
        this.board.suspendUpdate();
        this.getFirstJsxCurve().decreaseContinuity();
        this.unsuspendBoardUpdate();
    }

    private increaseDegree() {
        this.board.suspendUpdate();
        this.getFirstJsxCurve().increaseDegree();
        this.unsuspendBoardUpdate();
    }

    private decreaseDegree() {
        this.board.suspendUpdate();
        this.getFirstJsxCurve().decreaseDegree();
        this.unsuspendBoardUpdate();

    }
}

export default Graph;
