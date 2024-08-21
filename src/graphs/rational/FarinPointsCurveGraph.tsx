import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import React from "react";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {CacheContext} from "../context/CacheContext";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<any, BaseGraphStates> {

    override initialize() {
        super.initialize();
        if (this.getFirstJsxCurve().isShowingFarinPoints()) {
            this.showFarinPoints(true);
        }
        CacheContext.update();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(<OnOffSwitch
            initialState={this.getFirstJsxCurve().isShowingFarinPoints()}
            onChange={(checked) => this.showFarinPoints(checked)} label={"Farinove Točke"}/>, <OnOffSwitch
            initialState={this.getFirstJsxCurve().isShowingWeights()}
            onChange={(checked) => this.getFirstJsxCurve().showwWeights(checked)} label={"Uteži"}/>, <OnOffSwitch
            initialState={this.getFirstJsxCurve().inStandardForm()}
            onChange={(checked) => this.getFirstJsxCurve().setStandardForm(checked)}
            label={"Standardna Forma"}/>) : [];
    }

    defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "weights": [1, 5, 1, 1], "state": {
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
        this.getFirstJsxCurve().showFarinPoints(checked);
        this.getAllJxgPoints().forEach(point => point.setAttribute({fixed: checked}));
        this.inputsDisabled = checked;
    }
}

export default RationalBezierCurveGraph;
