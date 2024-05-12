import React from 'react';
import '../../App.css';
import {Button} from "../../inputs/Button";
import {
    BaseRationalBezierCurveGraphProps,
    BaseRationalBezierCurveGraphState,
    BaseRationalCurveGraph
} from "./BaseRationalCurveGraph";

class GraphExtrapolation extends BaseRationalCurveGraph<BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState> {
    private slider: JXG.Slider | undefined;

    initialize() {
        this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.getFirstJsxCurve().setIntervalEnd(this.slider!.Value())
        this.slider.on("drag", () => {
            this.getFirstJsxCurve().setIntervalEnd(this.slider!.Value())
            this.board.update()
        })
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
