import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph} from "./BaseCurveGraph";

class GraphExtrapolation extends BaseCurveGraph {
    private slider: JXG.Slider | undefined;

    initialize() {
        this.createJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.jsxBezierCurves[0].setIntervalEnd(this.slider!.Value())
        this.slider.on("drag", () => {
            this.jsxBezierCurves[0].setIntervalEnd(this.slider!.Value())
            this.board.update()
        })
    }

    protected getAdditionalCommands(): JSX.Element {
        return <Button onClick={() => this.extrapolate()} text="Ekstrapoliraj"/>;
    }

    private extrapolate() {
        this.jsxBezierCurves[0].extrapolate(this.slider!.Value())
        this.board.update()
    }

}

export default GraphExtrapolation;
