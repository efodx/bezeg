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
        return [["JSXBezierCurve", {
            "points": [[-4, -3], [-3, 2], [0, 3], [3, 2], [4, -3]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": true,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2
            }
        }]]
    }

    override presets(): string {
        return "decasteljau"
    }

    override initialize() {
        super.initialize()
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints()
        this.getFirstJsxCurve().setIntervalEnd(() => this.state.t)
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
        this.getFirstJsxCurve().showDecasteljauPoints()
        this.boardUpdate()
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch initialState={this.animating}
                                                                                      onChange={checked => this.animate(checked)}
                                                                                      label={"Animiraj"}></OnOffSwitch>,
            <OnOffSwitch initialState={this.animating}
                         onChange={checked => this.animate(checked)}
                         label={"Oznake točk"}></OnOffSwitch>,
            <Slider customText={'t = ' + this.state.t.toFixed(2)} min={0} max={1}
                    fixedValue={this.state.t}
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
