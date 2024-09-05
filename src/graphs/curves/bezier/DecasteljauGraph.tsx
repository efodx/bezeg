import React from 'react';

import {Colors} from "./utilities/Colors";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import Slider from "../../../inputs/Slider";
import {CurveStyles} from "../../styles/CurveStyles";
import {Attributes} from "../../attributes/Attributes";

interface DecasteljauGraphStates extends BaseGraphStates {
    t: number,
    v: number,
    wholeCurve?: boolean
}

class DecasteljauGraph extends BaseBezierCurveGraph<any, DecasteljauGraphStates> {
    private animating: boolean = false;

    override getInitialState(): DecasteljauGraphStates {
        return {...super.getInitialState(), t: 0.5, v: 1};
    }

    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<DecasteljauGraphStates>, snapshot?: any) {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().setDecasteljauT(this.state.t);
        this.unsuspendBoardUpdate();
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
        }]];
    }

    override presets(): string {
        return "decasteljau";
    }

    override initialize() {
        super.initialize();
        this.graphJXGPoints = this.getFirstJxgCurve().getJxgPoints();
        this.getFirstJxgCurve().setIntervalEnd(() => this.state.wholeCurve ? 1 : this.state.t);
        this.getFirstJxgCurve().setAttributes(Attributes.bezierDisabled);
        this.getFirstJxgCurve().showDecasteljauPoints();

        const curve = this.getFirstCurve();
        this.board.create('curve',
            [(t: number) => {
                return curve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return curve.calculatePointAtT(t).Y();
                },
                () => this.state.t,
                1
            ], {...CurveStyles.default, strokeColor: Colors[2], visible: () => this.state.wholeCurve}
        );
        this.boardUpdate();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch
            initialState={this.state.wholeCurve ? this.state.wholeCurve : false}
            onChange={checked => this.setState({...this.state, wholeCurve: checked})}
            label={"Celotna krivulja"}></OnOffSwitch>,
            <OnOffSwitch initialState={this.animating}
                         onChange={checked => this.animate(checked)}
                         label={"Animiraj"}></OnOffSwitch>,
            <Slider customText={'t = ' + this.state.t.toFixed(2)} min={0} max={1}
                    fixedValue={this.state.t}
                    onChange={(t) => this.setState({...this.state, t: t})}></Slider>,
            <Slider customText={'Hitrost animacije'} min={0} max={1} fixedValue={this.state.v}
                    onChange={(v) => this.setState({...this.state, v: v})}></Slider>]) : [];
    }

    private animate(animate: boolean) {
        if (animate) {
            this.animating = true;
            this.animateRecursive(this.state.t);
        } else {
            this.animating = false;
        }
    }

    private animateRecursive(t: number) {
        let dt = 0.015 * this.state.v;
        if (t + dt > 1) {
            t = 0;
        }
        this.setState({...this.state, t: t});
        if (this.animating) {
            window.requestAnimationFrame(() => this.animateRecursive(t + dt));
        }
    }

}

export default DecasteljauGraph;
