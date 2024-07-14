import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";

class GraphExtrapolation extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider?: JXG.Slider;

    defaultPreset() {
        return "[\"JSXBezierCurve|{\\\"points\\\":[[-4,-3],[-3,2],[2,2],[3,-2]]}\"]"
    }

    override presets() {
        return "bezier-extrapolation"
    }

    override initialize() {
        super.initialize()
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.getFirstJsxCurve().setIntervalEnd(() => this.slider!.Value())
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