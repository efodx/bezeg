import '../../App.css';
import {BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import Form from 'react-bootstrap/Form';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "../ph/BasePhBezierCurveGraph";
import React from "react";
import {range} from "../../utils/Range";

interface UniformParamBezierCurveGraphStates extends BasePhBezierCurveGraphStates {
    isAlphaParam: boolean
}


class UniformParamBezierCurveGraph extends BasePhBezierCurveGraph<BaseCurveGraphProps, UniformParamBezierCurveGraphStates> {
    numberOfPoints: number = 10;
    alpha: number = 0.5;
    private ts!: any[];

    defaultPreset(): string {
        throw new Error('Method not implemented.');
    }

    override getInitialState(): UniformParamBezierCurveGraphStates {
        return {
            ...super.getInitialState(),
            isAlphaParam: true
        };
    }

    getStartingHodographs(): number[][] {
        return [[-3, 2], [2, 2]];
    }

    getStartingPoints(): number[][] {
        return [[0, 0]];
    }

    alphaParam: (t: number) => number = (t: number) => (1 - this.alpha) * t / (this.alpha * (1 - t) + (1 - this.alpha) * t);

    override initialize() {
        super.initialize()
        this.generateParamPoints()
    }

    override getFirstCurve(): PhBezierCurve {
        return super.getFirstCurve() as PhBezierCurve
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(this.paramField());
    }

    setAlpha(alpha: number) {
        this.board.suspendUpdate()
        this.alpha = alpha
        this.clearPoints()
        this.generateParamPoints()
        this.unsuspendBoardUpdate()
    }

    getUniformParamTs() {
        const curve = this.getFirstCurve()
        const curveLength = curve.s(1)
        const ds = curveLength / (this.numberOfPoints + 1)
        let t = 0
        const ts = []
        for (let i = 0; i <= this.numberOfPoints; i++) {
            t = curve.tk(t, ds, i + 1)
            ts.push(t)
        }
        return ts
    }

    setNumberOfPoints(numberOfPoints: number) {
        this.board.suspendUpdate()
        this.numberOfPoints = numberOfPoints
        this.clearPoints()
        this.generateParamPoints()
        this.unsuspendBoardUpdate()
    }

    paramField() {
        return <div>
            <Form className={'mb-3'}>
                <Form.Select onChange={select => this.selectParam(select)} aria-label="Default select example">
                    <option value="alpha">Alfa parametrizacija</option>
                    <option value="uniform">Enakomerna parametrizacija</option>
                </Form.Select>
            </Form>
            <div>Število točk <Slider min={1} max={40} step={1}
                                      initialValue={this.numberOfPoints}
                                      onChange={(num) => this.setNumberOfPoints(num)}/>
            </div>
            {this.state.isAlphaParam ? <div>
                Alfa
                <Slider min={0} max={1} initialValue={this.alpha}
                        onChange={(alpha) => this.setAlpha(alpha)}/>
            </div> : null}

        </div>
    }

    clearPoints() {
        this.board.removeObject(this.graphJXGPoints)
        this.graphJXGPoints = []
    }

    generateParamPoints(isAlphaParam?: boolean) {
        if (isAlphaParam === undefined) {
            isAlphaParam = this.state.isAlphaParam
        }
        const dt = 1 / (this.numberOfPoints + 1)

        if (isAlphaParam) {
            this.ts = range(1, this.numberOfPoints + 1, 1).map(i => this.alphaParam(i * dt))
        } else {
            this.ts = this.getUniformParamTs()
        }
        for (let i = 1; i <= this.numberOfPoints; i++) {
            this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).X(),
                () => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).Y())
        }
    }

    private selectParam(select: React.SyntheticEvent<HTMLSelectElement>) {
        // @ts-ignore
        const param = select.target.value
        let isAlphaParam = false;
        if (param === "alpha") {
            isAlphaParam = true
        }
        this.setState({...this.state, isAlphaParam: isAlphaParam})
        this.board.suspendUpdate()
        this.clearPoints()
        // we need to pass isAlphaParam as a parameter, otherwise this would get ran with the previous state - this is probably anti-react
        this.generateParamPoints(isAlphaParam)
        this.unsuspendBoardUpdate()
    }
}

export default UniformParamBezierCurveGraph;
