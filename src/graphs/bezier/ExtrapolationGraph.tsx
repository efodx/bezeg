import React from 'react';
import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {Button} from "react-bootstrap";

class GraphExtrapolation extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider?: JXG.Slider;

    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.getFirstJsxCurve().setIntervalEnd(() => this.slider!.Value())
        //this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.extrapolate()}>Ekstrapoliraj</Button>])
    }

    private extrapolate() {
        this.getFirstJsxCurve().extrapolate(this.slider!.Value())
        this.board.update()
    }

}

export default GraphExtrapolation;