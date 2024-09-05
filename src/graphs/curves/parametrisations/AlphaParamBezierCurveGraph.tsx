import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import React from "react";
import Slider from "../../../inputs/Slider";

interface AlphaParamGraphStates extends BaseGraphStates {
    numberOfPoints: number;
    alpha: number;
}

class AlphaParamBezierCurveGraph extends BaseBezierCurveGraph<any, AlphaParamGraphStates> {

    override getInitialState() {
        return {
            ...super.getInitialState(),
            numberOfPoints: 10,
            alpha: 0.5,
        };
    }

    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<AlphaParamGraphStates>, snapshot?: any) {
        this.board.suspendUpdate();
        this.clearPoints();
        this.generateParamPoints();
        this.unsuspendBoardUpdate();
    }

    defaultPreset(): any {
        return [["JSXBezierCurve", {
            "points": [[-4, -3], [-3, 2], [2, 2], [3, -2]], "state": {
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

    alphaParam: (t: number) => number = (t: number) => (1 - this.state.alpha) * t / (this.state.alpha * (1 - t) + (1 - this.state.alpha) * t);

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.alphaParamSlider(), this.numberOfPointsSlider()) : [];
    }

    setAlpha(alpha: number) {
        this.setState({...this.state, alpha: alpha});
    }

    setNumberOfPoints(numberOfPoints: number) {
        this.setState({...this.state, numberOfPoints: numberOfPoints});
    }

    alphaParamSlider() {
        return <div>Alfa<Slider min={0} max={1} initialValue={this.state.alpha}
                                onChange={(alpha) => this.setAlpha(alpha)}/></div>;
    }

    numberOfPointsSlider() {
        return <div>Število točk <Slider min={1} max={40} step={1}
                                         initialValue={this.state.numberOfPoints}
                                         onChange={(num) => this.setNumberOfPoints(num)}/>
        </div>;
    }

    clearPoints() {
        this.board.removeObject(this.graphJXGPoints);
        this.graphJXGPoints = [];
    }

    generateParamPoints() {
        const dt = 1 / (this.state.numberOfPoints + 1);
        for (let i = 1; i <= this.state.numberOfPoints; i++) {
            this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).X(), () => this.getFirstCurve()!.calculatePointAtT(this.alphaParam(i * dt)).Y());
        }
    }

    override presets(): string | undefined {
        return "alpha-param";
    }
}

export default AlphaParamBezierCurveGraph;
