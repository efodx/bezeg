import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {JSXPHBezierCurve} from "../ph/JSXPHBezierCurve";
import {PhBezierCurve} from "../../bezeg/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import Form from 'react-bootstrap/Form';

interface UniformParamBezierCurveGraphStates extends BaseGraphStates {
    isAlphaParam: boolean
}

const range = (start: number, stop: number, step: number) => Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);

class UniformParamBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, UniformParamBezierCurveGraphStates> {
    numberOfPoints: number = 10;
    alpha: number = 0.5;
    private ts!: any[];

    override getInitialState(): UniformParamBezierCurveGraphStates {
        return {
            ...super.getInitialState(),
            isAlphaParam: true
        };
    }

    alphaParam: (t: number) => number = (t: number) => (1 - this.alpha) * t / (this.alpha * (1 - t) + (1 - this.alpha) * t);

    initialize() {
        const points = [[0, 0], [-3, 2], [2, 2]]
        this.createJSXBezierCurve(points)
        this.generateParamPoints()
    }

    override getFirstCurve(): PhBezierCurve {
        return super.getFirstCurve() as PhBezierCurve
    }

    override newJSXBezierCurve(points: number[][]): JSXPHBezierCurve {
        return new JSXPHBezierCurve(points, this.board);
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
        if (isAlphaParam == undefined) {
            isAlphaParam = this.state.isAlphaParam
        }
        const dt = 1 / (this.numberOfPoints + 1)

        if (isAlphaParam) {
            this.ts = range(1, this.numberOfPoints + 1, 1).map(i => this.alphaParam(i * dt))
        } else {
            this.ts = this.getUniformParamTs()
        }
        range(1, this.numberOfPoints + 1, 1)
            .map(i =>
                this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).X(),
                    () => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).Y()))
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
        // we need to pass isAlphaParam as a parameter, otherwise this would get ran with the previous state!
        this.generateParamPoints(isAlphaParam)
        this.unsuspendBoardUpdate()
    }
}

export default UniformParamBezierCurveGraph;