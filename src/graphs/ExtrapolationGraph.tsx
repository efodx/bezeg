import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";

class GraphExtrapolation extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider: JXG.Slider | undefined;

    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.getFirstJsxCurve().setIntervalEnd(() => this.slider!.Value())
        //this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
    }

    getGraphCommands(): JSX.Element[] {
        return [<Button onClick={() => this.extrapolate()} text="Ekstrapoliraj"/>]
    }

    private extrapolate() {
        this.getFirstJsxCurve().extrapolate(this.slider!.Value())
        this.board.update()
    }

}

export default GraphExtrapolation;
