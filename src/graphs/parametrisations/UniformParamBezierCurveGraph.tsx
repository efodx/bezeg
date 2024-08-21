import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import Form from 'react-bootstrap/Form';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "../ph/BasePhBezierCurveGraph";
import React from "react";
import {range} from "../../utils/Range";

interface UniformParamBezierCurveGraphStates extends BasePhBezierCurveGraphStates {
    isAlphaParam: boolean
    numberOfPoints: number
    alpha: number
}

class UniformParamBezierCurveGraph extends BasePhBezierCurveGraph<any, UniformParamBezierCurveGraphStates> {
    private ts!: any[];

    defaultPreset(): any {
        return [["JSXPHBezierCurve", {
            "points": [[0, 0]], "hodographs": [[-3, 2], [2, 2]], "state": {
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
        if (this.state.initialized && this.graphJXGPoints.length === 0) {
            this.generateParamPoints();
        }
        return super.getGraphCommands().concat(this.paramField());
    }

    setAlpha(alpha: number) {
        this.board.suspendUpdate();
        this.setState({...this.state, alpha: alpha});
        //this.clearPoints()
        //this.generateParamPoints()
        this.refreshTs();
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
        this.board.suspendUpdate();
        this.setState({...this.state, numberOfPoints: numberOfPoints});
        this.clearPoints();
        this.generateParamPoints();
        this.unsuspendBoardUpdate();
    }

    paramField() {
        return <div>
            <Form className={'mb-3'}>
                <Form.Select
                    value={this.state.isAlphaParam ? "alpha" : "uniform"}
                    onChange={select => this.selectParam(select)}
                    aria-label="Default select example">
                    <option value="alpha">Alfa parametrizacija</option>
                    <option value="uniform">Enakomerna parametrizacija</option>
                </Form.Select>
            </Form>
            <div>Število točk <Slider min={1} max={40} step={1}
                                      initialValue={this.state.numberOfPoints}
                                      onChange={(num) => this.setNumberOfPoints(num)}/>
            </div>
            {this.state.isAlphaParam ? <div>
                Alfa
                <Slider min={0} max={1} initialValue={this.state.alpha}
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

    generateParamPoints(isAlphaParam?: boolean) {
        if (isAlphaParam === undefined) {
            isAlphaParam = this.state.isAlphaParam;
        }
        const dt = 1 / (this.state.numberOfPoints + 1);

        if (isAlphaParam) {
            this.ts = range(1, this.state.numberOfPoints + 1, 1).map(i => this.alphaParam(i * dt));
        } else {
            this.ts = this.getUniformParamTs();
        }
        for (let i = 1; i <= this.state.numberOfPoints; i++) {
            this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).X(), () => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).Y());
        }
    }

    override presets(): string | undefined {
        return "uniform-graph";
    }

    private selectParam(select: React.SyntheticEvent<HTMLSelectElement>) {
        // @ts-ignore
        const param = select.target.value;
        let isAlphaParam = false;
        if (param === "alpha") {
            isAlphaParam = true;
        }
        this.setState({...this.state, isAlphaParam: isAlphaParam});
        this.board.suspendUpdate();
        this.clearPoints();
        // we need to pass isAlphaParam as a parameter, otherwise this would get ran with the previous state - this is probably anti-react
        this.generateParamPoints(isAlphaParam);
        this.unsuspendBoardUpdate();
    }
}

export default UniformParamBezierCurveGraph;