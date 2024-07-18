import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import Slider from "../../inputs/Slider";
import {Attributes} from "../attributes/Attributes";

interface DecasteljauGraphStates extends BaseGraphStates {
    t: number
}

class DecasteljauGraph extends BaseBezierCurveGraph<any, DecasteljauGraphStates> {
    private animating: boolean = false;

    override getInitialState(): DecasteljauGraphStates {
        return {...super.getInitialState(), t: 0.5};
    }

    defaultPreset(): string {
        return '["JSXBezierCurve|{\\"points\\":[[-4,-3],[-3,2],[0,3],[3,2],[4,-3]]}"]'
    }

    override presets(): string {
        return "decasteljau"
    }

    override initialize() {
        super.initialize()
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints()
        this.graphJXGPoints.forEach((point, i) => point.setName("$$p_" + i + "^0$$"))
        this.setT(this.getFirstJsxCurve().getDecasteljauT())
        this.getFirstJsxCurve().setIntervalEnd(() => this.state.t)
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
        this.boardUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch initialState={this.animating}
                                                                                      onChange={checked => this.animate(checked)}
                                                                                      label={"Animiraj"}></OnOffSwitch>,
            <Slider min={0} max={1} fixedValue={this.state.t}
                    onChange={(t) => this.setT(t)}></Slider>]
        ) : []
    }

    private animate(animate: boolean) {
        if (animate) {
            this.animating = true
            this.animateRecursive(this.state.t, 0.01)
        } else {
            this.animating = false
        }
    }

    private animateRecursive(t: number, dt: number) {
        if (t + dt > 1) {
            t = 0
        }
        this.setT(t)
        if (this.animating) {
            window.requestAnimationFrame(() => this.animateRecursive(t + dt, dt))
        }
    }

    private setT(t: number) {
        this.setState({...this.state, t: t})
        this.getFirstJsxCurve().setDecasteljauT(t)
        this.boardUpdate()
    }
}

export default DecasteljauGraph;
