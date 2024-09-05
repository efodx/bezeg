import React from 'react';

import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BezierCurveAttributes} from "../object/AbstractJXGBezierCurve";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import Slider from '../../../inputs/Slider';

class GraphExtrapolation extends BaseRationalCurveGraph<any, BaseGraphStates> {
    override initialize() {
        super.initialize();
        this.getFirstJxgCurve().createExtrapolationPoint();
        this.getFirstJxgCurve().showExtrapolationPoint();
        this.getFirstJxgCurve().setAttributes({
            allowShrink: false,
            allowExtrapolation: false,
            allowElevation: false,
            allowDecasteljau: false,
            allowSubdivision: false
        } as BezierCurveAttributes);
        this.boardUpdate();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<div>
            <Slider min={1} max={1.5}
                    initialValue={this.getFirstJxgCurve().getExtrapolationT()}
                    onChange={(t) => this.getFirstJxgCurve().setExtrapolationT(t)}></Slider>
            <Button
                onClick={() => this.extrapolate()}>Ekstrapoliraj</Button>
        </div>]) : [];
    }

    defaultPreset(): any {
        return [["JSXRationalBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "weights": [1, 5, 1, 1], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "subdivisionT": 0.5,
                "extrapolationT": 1.2,
                "showingWeights": false,
                "weightNumber": 1,
                "showingFarinPoints": false
            }
        }]];
    }

    override presets(): string {
        return "rational-bezier-extrapolation";
    }

    override deselectSelectedCurve() {
        super.deselectSelectedCurve();
        this.getFirstJxgCurve().createExtrapolationPoint();
        this.getFirstJxgCurve().showExtrapolationPoint();
    }

    private extrapolate() {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().extrapolate(this.getFirstJxgCurve().getExtrapolationT());
        this.unsuspendBoardUpdate();
    }

}

export default GraphExtrapolation;
