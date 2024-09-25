import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import Slider from "../../../inputs/Slider";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.getBiSetters()
        ) : [];
    }

    defaultPreset(): any {
        return [["JSXSymmetricQuadraticG1SplineCurve", {
            "points": [[-4, 3], [-4, -3], [-1, -3], [-1, 3], [3, 3], [4, -3]], "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "g1-symmetric-spline-graph";
    }

    private getBiSetters() {
        return this.getFirstCurve().getBs().map(
            (b, i) => <div>
                <Slider initialValue={b} min={0.01} max={0.99}
                        onChange={(val) => this.changeBi(i, val)}/></div>
        );
    }

    private changeBi(i: number, val: number) {
        this.getFirstCurve().setB(i, val);
        this.boardUpdate();
    }


}

export default Graph;
