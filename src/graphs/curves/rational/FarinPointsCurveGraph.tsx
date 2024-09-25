import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import React from "react";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {CacheContext} from "../../context/CacheContext";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<any, BaseGraphStates> {

    override initialize() {
        super.initialize();
        if (this.getFirstJxgCurve().isShowingFarinPoints()) {
            this.showFarinPoints(true);
        }
        CacheContext.update();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(<OnOffSwitch
            initialState={this.getFirstJxgCurve().isShowingFarinPoints()}
            onChange={(checked) => this.showFarinPoints(checked)} label={"Farinove Točke"}/>, <OnOffSwitch
            initialState={this.getFirstJxgCurve().isShowingWeights()}
            onChange={(checked) => this.getFirstJxgCurve().showwWeights(checked)} label={"Uteži"}/>, <OnOffSwitch
            initialState={this.getFirstJxgCurve().inStandardForm()}
            onChange={(checked) => this.getFirstJxgCurve().setStandardForm(checked)}
            label={"Standardna Oblika"}/>) : [];
    }

    defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-4, -3], [-3, 3], [3, 3], [4, -3]], "weights": [1, 2, 1, 1], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "subdivisionT": 0.5,
                "extrapolationT": 1.2,
                "showingWeights": false,
                "weightNumber": 1,
                "showingFarinPoints": false
            }
        }]];
    }

    override presets(): string {
        return "rational-bezier-farin";
    }

    private showFarinPoints(checked: boolean) {
        this.getFirstJxgCurve().showFarinPoints(checked);
        this.getAllJxgPoints().forEach(point => point.setAttribute({fixed: checked}));
        this.inputsDisabled = checked;
    }
}

export default RationalBezierCurveGraph;
