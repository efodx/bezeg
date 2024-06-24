import '../../App.css';
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import React from "react";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {

    initialize() {
        let points = [[-2, -2], [-2, 2], [2, 2], [2, -2]]
        let weights = [1, 1, 1, 1]
        this.createRationalJSXBezierCurve(points, weights)
    }

    override getInitialState(): BaseRationalBezierCurveGraphState {
        return {
            ...super.getInitialState(),
            currentWeight: 2
        }

    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(<OnOffSwitch
            initialState={false}
            onChange={(checked) => this.showFarinPoints(checked)} label={"Farinove Točke"}/>);
    }

    private showFarinPoints(checked: boolean) {
        this.getFirstJsxCurve().showFarinPoints(checked)
        this.getAllJxgPoints().forEach(point => point.setAttribute({fixed: checked}))
        this.inputsDisabled = checked
    }
}

export default RationalBezierCurveGraph;
