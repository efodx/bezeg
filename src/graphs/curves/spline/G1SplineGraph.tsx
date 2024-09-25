import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {range} from "../../../utils/Range";
import Slider from "../../../inputs/Slider";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.getBiSetters()
        ) : [];
    }

    defaultPreset(): any {
        return [["JSXQuadraticG1SplineCurve", {
            "points": [[-2.5, 1], [-4, -1.5], [-2.5, -2.5], [0, -1], [3, 1]], "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "g1-spline-graph";
    }

    private getBiSetters() {
        return <div>
            <div>ß</div>
            {range(0, this.getFirstCurve().getNumOfBs() - 1, 1).map(
                i => <div>
                    <Slider initialValue={0.5} min={0.01} max={3}
                            onChange={(val) => this.changeBi(i, val)}/></div>
            )}</div>;
    }

    private changeBi(i: number, val: number) {
        this.getFirstCurve().setB(i, val);
        this.boardUpdate();
    }
}

export default Graph;
