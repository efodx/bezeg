import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import React from "react";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {
    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(<OnOffSwitch
                initialState={false}
                onChange={(checked) => this.showFarinPoints(checked)} label={"Farinove Točke"}/>,
            <OnOffSwitch initialState={this.getFirstJsxCurve() ? this.getFirstJsxCurve().isShowingWeights() : false}
                         onChange={(checked) => this.getFirstJsxCurve().showwWeights(checked)} label={"Uteži"}/>,
            <OnOffSwitch initialState={this.getFirstJsxCurve() ? this.getFirstJsxCurve().inStandardForm() : false}
                         onChange={(checked) => this.getFirstJsxCurve().setStandardForm(checked)}
                         label={"Standardna Forma"}/>);
    }

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,5,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier-farin"
    }

    private showFarinPoints(checked: boolean) {
        this.getFirstJsxCurve().showFarinPoints(checked)
        this.getAllJxgPoints().forEach(point => point.setAttribute({fixed: checked}))
        this.inputsDisabled = checked
    }
}

export default RationalBezierCurveGraph;
