import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {range} from "../../utils/Range";
import Slider from "../../inputs/Slider";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.getBiSetters()
        ) : [];
    }

    defaultPreset(): any {
        return [["JSXSymmetricQuadraticG1SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2]], "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "g1-symmetric-spline-graph";
    }

    private getBiSetters() {
        return range(1, this.getFirstCurve().getNumOfBs(), 1).map(
            i => <div>
                <Slider initialValue={0.5} min={0.01} max={0.99}
                        onChange={(val) => this.changeBi(i, val)}/></div>
        );
    }

    private changeBi(i: number, val: number) {
        this.getFirstCurve().setB(i - 1, val);
        this.boardUpdate();
    }
}

export default Graph;
