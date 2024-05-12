import React from 'react';
import '../../App.css';
import {Button} from "../../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";

interface DecasteljauGraphState extends BaseGraphStates {
    animating: boolean
}

class DecasteljauGraph extends BaseCurveGraph<BaseCurveGraphProps, DecasteljauGraphState> {
    private slider: JXG.Slider | undefined;
    private lastDrawn: number | undefined;

    initialize() {
        const points = [[-4, -3], [-3, 2], [0, 3], [3, 2], [4, -3]]
        this.createJSXBezierCurve(points)
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints()
        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.1, 1]]);
        this.lastDrawn = Date.now();
        this.getFirstJsxCurve().setIntervalEnd(() => this.slider!.Value())
        this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
        this.slider.setAttribute({moveOnUp: true})
        this.lastDrawn = Date.now()
        this.board.update()
    }

    getGraphCommands(): JSX.Element[] {
        return [this.state.animating ?
            <Button onClick={() => this.stopAnimation()} text="Ustavi"/> :
            <Button onClick={() => this.startAnimation()} text="Animiraj"/>];
    }

    private startAnimation() {
        // @ts-ignore
        this.slider?.startAnimation(1, 150, 15)
        this.setState({...this.state, animating: true})
    }

    private stopAnimation() {
        this.slider?.stopAnimation()
        this.setState({...this.state, animating: false})
    }
}

export default DecasteljauGraph;