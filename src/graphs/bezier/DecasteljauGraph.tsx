import React from 'react';
import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

class DecasteljauGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider?: JXG.Slider;

    initialize() {
        const points = [[-4, -3], [-3, 2], [0, 3], [3, 2], [4, -3]]
        this.createJSXBezierCurve(points)
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints()
        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.1, 1]]);
        this.getFirstJsxCurve().setIntervalEnd(() => this.slider!.Value())
        this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
        this.slider.setAttribute({moveOnUp: true})
        this.graphJXGPoints.forEach((point, i) => point.setName("$$p_" + i + "^0$$"))
        this.boardUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<OnOffSwitch initialState={false}
                                                             onChange={checked => this.animate(checked)}
                                                             label={"Animiraj"}></OnOffSwitch>]
        )
    }

    private animate(animate: boolean) {
        if (animate) {
            // @ts-ignore
            this.slider?.startAnimation(1, 150, 15)
        } else {
            this.slider?.stopAnimation()
        }
    }
}

export default DecasteljauGraph;
