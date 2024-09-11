import {BaseSplineCurveGraph} from "../spline/BaseSplineCurveGraph";
import {Colors} from "../bezier/utilities/Colors";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {PointStyles} from "../../styles/PointStyles";
import React from "react";
import Slider from "../../../inputs/Slider";
import {SizeContext} from "../../context/SizeContext";

interface SplineAlphaParamGraphStates extends BaseGraphStates {
    numberOfPoints: number;
    alpha: number;
}

class Graph extends BaseSplineCurveGraph<SplineAlphaParamGraphStates> {

    override getInitialState() {
        return {
            ...super.getInitialState(),
            numberOfPoints: 10,
            alpha: 0.5,
        };
    }

    override initialize() {
        super.initialize();
        this.generateParamPoints(15);
        this.setState({...this.state, alpha: this.getFirstCurve().getAlpha()});
    }

    override presets(): string {
        return "alfaparametrizacije";
    }


    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.alphaParamSlider(), this.numberOfPointsSlider()) : [];
    }

    setAlpha(alpha: number) {
        this.board.suspendUpdate();
        this.setState({...this.state, alpha: alpha});
        this.getFirstCurve().setAlpha(alpha);
        this.unsuspendBoardUpdate();
    }

    clearPoints() {
        this.board.removeObject(this.graphJXGPoints);
        this.graphJXGPoints = [];
    }

    setNumberOfPoints(numberOfPoints: number) {
        this.board.suspendUpdate();
        this.setState({...this.state, numberOfPoints: numberOfPoints});
        this.clearPoints();
        this.generateParamPoints(numberOfPoints);
        this.unsuspendBoardUpdate();
    }

    alphaParamSlider() {
        return <div>α<Slider min={0} max={1} step={0.01} initialValue={this.state.alpha}
                             onChange={(alpha) => this.setAlpha(alpha)}/></div>;
    }

    numberOfPointsSlider() {
        return <div>Število točk <Slider min={0} max={40} step={1}
                                         initialValue={this.state.numberOfPoints}
                                         onChange={(num) => this.setNumberOfPoints(num)}/>
        </div>;
    }

    defaultPreset(): any {
        return [["JSXQubicC2SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]],
            "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    generateParamPoints(numberOfPoints: number) {
        const dt = 1 / (numberOfPoints + 1);
        for (let i = 1; i <= numberOfPoints; i++) {
            this.createJSXGraphPoint(() => this.getFirstCurve()!.calculatePointAtT(i * dt).X(), () => this.getFirstCurve()!.calculatePointAtT(i * dt).Y(), {
                ...PointStyles.default,
                size: () => SizeContext.pointSize * 0.5,
                color: Colors[3]
            });
        }
    }

}

export default Graph;
