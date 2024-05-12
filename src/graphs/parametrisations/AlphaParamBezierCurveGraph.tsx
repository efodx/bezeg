import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import Slider from "../../inputs/Slider";

const range = (start: number, stop: number, step: number) => Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);

class AlphaParamBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    numberOfPoints: number = 10;
    alpha: number = 0.5;
    alphaParam: (t: number) => number = (t: number) => (1 - this.alpha) * t / (this.alpha * (1 - t) + (1 - this.alpha) * t);


    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        this.createJSXBezierCurve(points)
        this.generateParamPoints()
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(this.alphaParamSlider(),
            this.numberOfPointsSlider());
    }

    setAlpha(alpha: number) {
        this.board.suspendUpdate()
        this.alpha = alpha
        this.board.unsuspendUpdate()
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
        range(1, this.numberOfPoints, 1)
            .map(i =>
                this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).X(),
                    () => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).Y()))
    }
}

export default AlphaParamBezierCurveGraph;
