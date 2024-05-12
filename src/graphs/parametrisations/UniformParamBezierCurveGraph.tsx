import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {JSXPHBezierCurve} from "../ph/JSXPHBezierCurve";
import {PhBezierCurve} from "../../bezeg/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import {Button} from "../../inputs/Button";

const range = (start: number, stop: number, step: number) => Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);

class UniformParamBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    numberOfPoints: number = 10;
    alpha: number = 0.5;
    private ts!: any[];

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
        return super.getGraphCommands().concat(this.alphaParamSlider(),
            this.numberOfPointsSlider(),
            this.phParamButton());
    }

    setAlpha(alpha: number) {
        this.board.suspendUpdate()
        this.alpha = alpha
        const dt = 1 / (this.numberOfPoints + 1)
        this.ts = range(1, this.numberOfPoints, 1).map(i => i * dt).map(t => this.alphaParam(t))
        this.board.unsuspendUpdate()
    }

    setPhParam() {
        this.board.suspendUpdate()
        this.alpha = 1
        this.ts = this.getUniformParamTs()
        this.board.unsuspendUpdate()
    }

    getUniformParamTs() {
        const curve = this.getFirstCurve()
        const curveLength = curve.s(1)
        const ds = curveLength / (this.numberOfPoints + 1)
        let t = 0
        const ts = []
        for (var i = 0; i <= this.numberOfPoints; i++) {
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
        this.board.unsuspendUpdate()
    }

    alphaParamSlider() {
        return <div style={this.curveCommandStyle}>Alfa<Slider min={0} max={1} initialValue={this.alpha}
                                                               onChange={(alpha) => this.setAlpha(alpha)}/></div>
    }

    phParamButton() {
        return <Button text={"PH Parametrizacija"} onClick={() => this.setPhParam()}/>
    }

    numberOfPointsSlider() {
        return <div style={this.curveCommandStyle}>Število točk <Slider min={1} max={40} step={1}
                                                                        initialValue={this.numberOfPoints}
                                                                        onChange={(num) => this.setNumberOfPoints(num)}/>
        </div>
    }

    clearPoints() {
        this.board.removeObject(this.graphJXGPoints)
        this.graphJXGPoints = []
    }

    generateParamPoints() {
        const dt = 1 / (this.numberOfPoints + 1)
        this.ts = range(1, this.numberOfPoints, 1).map(i => i * dt)

        if (this.alpha != 1) {
            this.ts = this.ts.map(t => this.alphaParam(t))
        } else {
            this.ts = this.getUniformParamTs()
        }
        range(1, this.numberOfPoints + 1, 1)
            .map(i =>
                this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).X(),
                    () => this.getFirstCurve()!.calculatePointAtT(this.ts[i - 1]).Y()))
    }


}

export default UniformParamBezierCurveGraph;
