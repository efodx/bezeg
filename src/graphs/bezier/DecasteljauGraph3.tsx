import React from 'react';

import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import Slider from "../../inputs/Slider";
import {Attributes} from "../attributes/Attributes";
import {CurveStyles} from "../styles/CurveStyles";
import {Color} from "./utilities/Colors";
import {Button} from "react-bootstrap";

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
        this.getFirstJsxCurve().setDecasteljauT(this.state.t);
        this.unsuspendBoardUpdate();
    }

    defaultPreset(): any {
        return [["JSXBezierCurve", {
            "points": [[-4, -3], [-3, 3], [3, 3], [4, -3]], "state": {
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
        return "decasteljau3";
    }

    override initialize() {
        super.initialize();
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints();
        this.getFirstJsxCurve().setIntervalEnd(() => this.state.wholeCurve ? 1 : this.state.t);
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled);
        this.getFirstJsxCurve().showDecasteljauPoints();

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
            ], {...CurveStyles.default, strokeColor: Color.GREAT_ORANGE, visible: () => this.state.wholeCurve}
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
                    onChange={(v) => this.setState({...this.state, v: v})}></Slider>,
            <Button onClick={() => this.subdivide()}>Subdiviziraj</Button>]) : [];
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

    private subdivide() {
        const newcurve = this.getFirstJsxCurve().subdivide();
        this.getFirstJsxCurve().showCurrentDecasteljauScheme(false);
        newcurve.getJxgCurve().setAttribute({strokeColor: Color.GREAT_ORANGE});
    }
}

export default DecasteljauGraph;
