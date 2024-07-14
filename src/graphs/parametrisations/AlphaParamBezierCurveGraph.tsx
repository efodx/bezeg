import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import Slider from "../../inputs/Slider";

class AlphaParamBezierCurveGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    numberOfPoints: number = 10;
    alpha: number = 0.5;

    defaultPreset(): string {
        throw new Error('Method not implemented.');
    }

    alphaParam: (t: number) => number = (t: number) => (1 - this.alpha) * t / (this.alpha * (1 - t) + (1 - this.alpha) * t);


    override initialize() {
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
        this.unsuspendBoardUpdate()
    }

    setNumberOfPoints(numberOfPoints: number) {
        this.board.suspendUpdate()
        this.numberOfPoints = numberOfPoints
        this.clearPoints()
        this.generateParamPoints()
        this.unsuspendBoardUpdate()
    }

    alphaParamSlider() {
        return <div>Alfa<Slider min={0} max={1} initialValue={this.alpha}
                                onChange={(alpha) => this.setAlpha(alpha)}/></div>
    }

    numberOfPointsSlider() {
        return <div>Število točk <Slider min={1} max={40} step={1}
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
        for (let i = 1; i <= this.numberOfPoints; i++) {
            this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).X(),
                () => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).Y())
        }
    }
}

export default AlphaParamBezierCurveGraph;
