import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import Slider from "../../inputs/Slider";
import {Attributes} from "../attributes/Attributes";

interface DecasteljauGraphStates extends BaseGraphStates {
    t: number,
    v: number
}

class DecasteljauGraph extends BaseBezierCurveGraph<any, DecasteljauGraphStates> {
    private animating: boolean = false;

    override getInitialState(): DecasteljauGraphStates {
        return {...super.getInitialState(), t: 0.5, v: 1};
    }

    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<DecasteljauGraphStates>, snapshot?: any) {
        this.getFirstJsxCurve().setDecasteljauT(this.state.t)
    }

    defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "weights": [1, 2, 1, 1], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "subdivisionT": 0.5,
                "extrapolationT": 1.2,
                "showingWeights": false,
                "weightNumber": 1,
                "showingFarinPoints": false
            }
        }]];
    }

    override presets(): string {
        return "decasteljau"
    }

    override initialize() {
        super.initialize()
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints()
        this.graphJXGPoints.forEach((point, i) => point.setName("$$p_" + i + "^0$$"))
        this.getFirstJsxCurve().setIntervalEnd(() => this.state.t)
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
        this.boardUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch initialState={this.animating}
                                                                                      onChange={checked => this.animate(checked)}
                                                                                      label={"Animiraj"}></OnOffSwitch>,
            <Slider customText={'t' + this.state.t} min={0} max={1} fixedValue={this.state.t}
                    onChange={(t) => this.setState({...this.state, t: t})}></Slider>,
            <Slider customText={'Hitrost animacije'} min={0} max={1} fixedValue={this.state.v}
                    onChange={(v) => this.setState({...this.state, v: v})}></Slider>]) : []
    }

    private animate(animate: boolean) {
        if (animate) {
            this.animating = true
            this.animateRecursive(this.state.t)
        } else {
            this.animating = false
        }
    }

    private animateRecursive(t: number) {
        let dt = 0.015 * this.state.v
        if (t + dt > 1) {
            t = 0
        }
        this.setState({...this.state, t: t})
        if (this.animating) {
            window.requestAnimationFrame(() => this.animateRecursive(t + dt))
        }
    }

}

export default DecasteljauGraph;
