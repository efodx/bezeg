import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";

class GraphExtrapolation extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {
    private slider?: JXG.Slider;

    override initialize() {
        super.initialize()
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.getFirstJsxCurve().setIntervalEnd(this.slider!.Value())
        this.slider.on("drag", () => {
            this.getFirstJsxCurve().setIntervalEnd(this.slider!.Value())
            this.board.update()
        })
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.extrapolate()}>Ekstrapoliraj</Button>])
    }

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,5,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier-extrapolation"
    }

    private extrapolate() {
        this.getFirstJsxCurve().extrapolate(this.slider!.Value())
        this.board.update()
    }

}

export default GraphExtrapolation;
