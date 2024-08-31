import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {range} from "../../utils/Range";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.getBiSetters()
        ) : [];
    }

    defaultPreset(): any {
        return [["JSXQuadraticG1SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2]], "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "g1-spline-graph";
    }

    private getBiSetters() {
        return range(1, this.getFirstCurve().getNumOfBs(), 1).map(
            i => <div><Button onClick={() => this.povecajBi(i - 1)}>Povečaj B{i}</Button>
                <Button onClick={() => this.zmanjsajBi(i - 1)}>Zmanjšaj B{i}</Button></div>
        );
    }

    private povecajBi(i: number) {
        this.getFirstCurve().setB(i, this.getFirstCurve().getB(i) * 1.1);
        this.boardUpdate();
    }

    private zmanjsajBi(i: number) {
        this.getFirstCurve().setB(i, this.getFirstCurve().getB(i) * 0.9);
        this.boardUpdate();
    }


}

export default Graph;
