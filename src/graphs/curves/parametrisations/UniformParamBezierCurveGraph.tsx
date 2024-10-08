import Form from 'react-bootstrap/Form';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "../ph/BasePhBezierCurveGraph";
import React from "react";
import Slider from "../../../inputs/Slider";
import {range} from "../../../utils/Range";
import {PhBezierCurve} from "../../../bezeg/impl/curve/ph-bezier-curve";
import {PointStyles} from "../../styles/PointStyles";
import {SizeContext} from "../../context/SizeContext";
import {Color, Colors} from "../bezier/utilities/Colors";

interface UniformParamBezierCurveGraphStates extends BasePhBezierCurveGraphStates {
    isAlphaParam: boolean
    numberOfPoints: number
    alpha: number
}

class UniformParamBezierCurveGraph extends BasePhBezierCurveGraph<any, UniformParamBezierCurveGraphStates> {
    private ts!: any[];

    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<UniformParamBezierCurveGraphStates>, snapshot?: any) {
        if (super.componentDidUpdate) {
            super.componentDidUpdate(prevProps, prevState);
        }
        this.board.suspendUpdate();
        if (this.ts === undefined || this.ts.length - 1 !== this.state.numberOfPoints) {
            this.refreshTs();
            this.clearPoints();
            this.generateParamPoints();
        } else {
            this.refreshTs();
        }
        this.unsuspendBoardUpdate();
    }

    defaultPreset(): any {
        return [["JSXPHBezierCurve", {
            "points": [[-3, -4]], "hodographs": [[-4.5, -4], [-1, 0], [-4.5, 4]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2,
                "showOffsetCurveControlPoints": false,
                "showOffsetCurve": false
            }
        }]];
    }

    override getInitialState(): UniformParamBezierCurveGraphStates {
        return {
            ...super.getInitialState(), isAlphaParam: true, alpha: 0.5, numberOfPoints: 10
        };
    }

    alphaParam: (t: number) => number = (t: number) => (1 - this.state.alpha) * t / (this.state.alpha * (1 - t) + (1 - this.state.alpha) * t);

    override getFirstCurve(): PhBezierCurve {
        return super.getFirstCurve() as PhBezierCurve;
    }

    override getGraphCommands(): JSX.Element[] {
        return [this.paramField()];
    }

    setAlpha(alpha: number) {
        this.setState({...this.state, alpha: alpha});
        this.unsuspendBoardUpdate();
    }

    getUniformParamTs() {
        const curve = this.getFirstCurve();
        const curveLength = curve.s(1);
        const ds = curveLength / (this.state.numberOfPoints + 1);
        let t = 0;
        const ts = [];
        for (let i = 0; i <= this.state.numberOfPoints; i++) {
            t = curve.tk(t, ds, i + 1);
            ts.push(t);
        }
        return ts;
    }

    setNumberOfPoints(numberOfPoints: number) {
        this.setState({...this.state, numberOfPoints: numberOfPoints});
    }

    paramField() {
        return <div>
            <Form className={'mb-3'}>
                <Form.Select
                    value={this.state.isAlphaParam ? "alpha" : "uniform"}
                    onChange={select => this.selectParam(select)}
                    aria-label="Default select example">
                    <option value="alpha">Utežena parametrizacija</option>
                    <option value="uniform">Enakomerna parametrizacija</option>
                </Form.Select>
            </Form>
            <div>Število točk <Slider min={1} max={40} step={1}
                                      initialValue={this.state.numberOfPoints}
                                      onChange={(num) => this.setNumberOfPoints(num)}/>
            </div>
            {this.state.isAlphaParam ? <div>
                <Slider min={0} max={1} initialValue={this.state.alpha} customText={'α'}
                        onChange={(alpha) => this.setAlpha(alpha)}/>
            </div> : null}

        </div>;
    }

    clearPoints() {
        this.board.removeObject(this.graphJXGPoints);
        this.graphJXGPoints = [];
    }

    refreshTs() {
        const dt = 1 / (this.state.numberOfPoints + 1);
        if (this.state.isAlphaParam) {
            this.ts = range(1, this.state.numberOfPoints + 1, 1).map(i => this.alphaParam(i * dt));
        } else {
            this.ts = this.getUniformParamTs();
        }
    }

    generateParamPoints() {
        console.log(this.ts);
        for (let i = 1; i <= this.state.numberOfPoints; i++) {
            let point = this.createJSXGraphPoint(() => this.getFirstCurve()!.eval(this.ts[i - 1]).X(), () => this.getFirstCurve()!.eval(this.ts[i - 1]).Y(), {
                ...PointStyles.fixed,
                size: () => SizeContext.pointSize * 0.5,
                color: Colors[3],
            });
            // For some reason you cant set color and stroke color at the same time....
            point.point.setAttribute({
                strokeWidth: () => SizeContext.pointSize / 5,
                strokeColor: Color.BLACK,
            });
        }
    }

    override presets(): string | undefined {
        return "uniform-graph";
    }

    private selectParam(select: React.SyntheticEvent<HTMLSelectElement>) {
        // @ts-ignore
        const param = select.target.value;
        this.setState({...this.state, isAlphaParam: param === "alpha"});
    }
}

export default UniformParamBezierCurveGraph;