import React from 'react';

import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import Slider from "../../inputs/Slider";
import {Attributes} from "../attributes/Attributes";
import {JSXBezierCurve} from "../object/JSXBezierCurve";
import {PointStyles} from "../styles/PointStyles";
import {SegmentStyles} from "../styles/SegmentStyles";
import {BezierCurveImpl} from "../../bezeg/impl/curve/bezier-curve-impl";
import {CurveStyles} from "../styles/CurveStyles";
import {Color, Colors} from "./utilities/Colors";

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
        this.getFirstJsxCurve().setDecasteljauT(this.state.t);
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
        this.getFirstJsxCurve().setAttributes({...this.getFirstJsxCurve().getAttributes(), selectable: false});
        this.graphJXGPoints = this.getFirstJsxCurve().getJxgPoints();
        this.generateInterpolatingBezierCurves();

        this.getFirstJsxCurve().setIntervalEnd(() => this.state.t);
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled);
        this.getFirstJsxCurve().setDecasteljauT(this.state.t);
        // this.getFirstJsxCurve().showDecasteljauPoints()
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
        const points = this.getFirstJsxCurve().getCurve().getPoints();
        const curve1points = points.slice(0, this.graphJXGPoints.length - 1);
        const curve2points = points.slice(1, this.graphJXGPoints.length);
        const curvee = new BezierCurveImpl(curve1points);
        const curvee2 = new BezierCurveImpl(curve2points);


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
        const drawingPoint = this.board?.create('point', [() => this.getFirstJsxCurve().getCurve().calculatePointAtT(this.state.t).X(), () => this.getFirstJsxCurve().getCurve().calculatePointAtT(this.state.t).Y()], {
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
