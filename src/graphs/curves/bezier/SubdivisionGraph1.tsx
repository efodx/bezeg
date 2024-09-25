import React from 'react';

import {Color} from "./utilities/Colors";
import {Button} from "react-bootstrap";
import {BaseGraphStates} from '../../base/BaseCurveGraph';
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import Slider from "../../../inputs/Slider";
import {CurveStyles} from "../../styles/CurveStyles";
import {Attributes} from "../../attributes/Attributes";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";

interface DecasteljauGraphStates extends BaseGraphStates {
    t: number,
    v: number,
    showDecasteljau?: boolean
}

class SubdivisionGraph1 extends BaseBezierCurveGraph<any, DecasteljauGraphStates> {

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
        return "subdivision-1";
    }

    override initialize() {
        super.initialize();
        this.graphJXGPoints = this.getFirstJxgCurve().getJxgPoints();
        this.getFirstJxgCurve().setIntervalEnd(() => this.state.showDecasteljau ? 1 : this.state.t);
        this.getFirstJxgCurve().setAttributes(Attributes.bezierDisabled);
        this.getFirstJxgCurve().showDecasteljauPoints();

        const curve = this.getFirstCurve();
        this.board.create('curve',
            [(t: number) => {
                return curve.eval(t).X();
            },
                (t: number) => {
                    return curve.eval(t).Y();
                },
                () => this.state.t,
                1
            ], {...CurveStyles.default, strokeColor: Color.GREAT_ORANGE}
        );
        this.boardUpdate();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch
            key={this.state.showDecasteljau + ""}
            initialState={this.getFirstJxgCurve().isShowingDecasteljauScheme() || this.state.showDecasteljau}
            onChange={checked => {
                this.getFirstJxgCurve().showCurrentDecasteljauScheme(checked);
                this.setState({...this.state, showDecasteljau: checked});
                this.boardUpdate();
            }}
            label={"Prikazuj shemo"}></OnOffSwitch>,
            <Slider customText={'t = ' + this.state.t.toFixed(2)} min={0.01} max={0.99}
                    fixedValue={this.state.t}
                    onChange={(t) => this.setState({...this.state, t: t})}></Slider>,
            <Button onClick={() => this.subdivide()}>Subdiviziraj</Button>]) : [];
    }

    private subdivide() {
        this.getFirstJxgCurve().setSubdivisionT(this.state.t);
        const newcurve = this.getFirstJxgCurve().subdivide();
        this.getFirstJxgCurve().showCurrentDecasteljauScheme(false);
        newcurve.getJxgCurve().setAttribute({strokeColor: Color.GREAT_ORANGE});
        this.boardUpdate();
        this.setState({...this.state, t: 1, showDecasteljau: false});
    }
}

export default SubdivisionGraph1;
