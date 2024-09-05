import React from 'react';

import {Color, Colors} from "./utilities/Colors";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import {Attributes} from "../../attributes/Attributes";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import Slider from "../../../inputs/Slider";
import {PolynomialBezierCurve} from "../../../bezeg/impl/curve/polynomial-bezier-curve";
import {PointStyles} from "../../styles/PointStyles";
import {SegmentStyles} from "../../styles/SegmentStyles";
import {CurveStyles} from "../../styles/CurveStyles";

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
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2
            }
        }]];
    }


    override presets(): string {
        return "decasteljau2";
    }

    override initialize() {
        super.initialize();
        this.getFirstJxgCurve().setAttributes({...this.getFirstJxgCurve().getAttributes(), selectable: false});
        this.graphJXGPoints = this.getFirstJxgCurve().getJxgPoints();
        this.generateInterpolatingBezierCurves();

        this.getFirstJxgCurve().setIntervalEnd(() => this.state.t);
        this.getFirstJxgCurve().setAttributes(Attributes.bezierDisabled);
        this.getFirstJxgCurve().setDecasteljauT(this.state.t);
        // this.getFirstJxgCurve().showDecasteljauPoints()
        this.boardUpdate();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<OnOffSwitch initialState={this.animating}
                                                                                      onChange={checked => this.animate(checked)}
                                                                                      label={"Animiraj"}></OnOffSwitch>,
            <Slider customText={'t = ' + this.state.t.toFixed(2)} min={0} max={1}
                    fixedValue={this.state.t}
                    onChange={(t) => this.setState({...this.state, t: t})}></Slider>,
            <Slider customText={'Hitrost animacije'} min={0} max={1} fixedValue={this.state.v}
                    onChange={(v) => this.setState({...this.state, v: v})}></Slider>]) : [];
    }

    private generateInterpolatingBezierCurves() {
        const points = this.getFirstJxgCurve().getCurve().getPoints();
        const curve1points = points.slice(0, this.graphJXGPoints.length - 1);
        const curve2points = points.slice(1, this.graphJXGPoints.length);
        const curvee = new PolynomialBezierCurve(curve1points);
        const curvee2 = new PolynomialBezierCurve(curve2points);


        const p1 = this.createJSXGraphPoint(() => curvee.calculatePointAtT(this.state.t).X(), () => curvee.calculatePointAtT(this.state.t).Y(), PointStyles.fixed);
        const pp1 = this.graphJXGPoints[this.graphJXGPoints.length - 1];
        const p2 = this.createJSXGraphPoint(() => curvee2.calculatePointAtT(this.state.t).X(), () => curvee2.calculatePointAtT(this.state.t).Y(), PointStyles.fixed);
        const pp2 = this.graphJXGPoints[this.graphJXGPoints.length - 1];

        const segment = this.board.create('segment', [pp1, pp2], SegmentStyles.default);

        this.board.create('curve',
            [(t: number) => {
                return curvee.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return curvee.calculatePointAtT(t).Y();
                },
                0,
                () => 1
            ], {...CurveStyles.default, strokeColor: Color.E, layer: 2}
        );
        this.board.create('curve',
            [(t: number) => {
                return curvee2.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return curvee2.calculatePointAtT(t).Y();
                },
                0,
                () => 1
            ], {...CurveStyles.default, strokeColor: Color.G, layer: 2}
        );
        const drawingPoint = this.board?.create('point', [() => this.getFirstJxgCurve().getCurve().calculatePointAtT(this.state.t).X(), () => this.getFirstJxgCurve().getCurve().calculatePointAtT(this.state.t).Y()], {
            ...PointStyles.default,
            color: Colors[4],
            name: () => ""
        });
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
