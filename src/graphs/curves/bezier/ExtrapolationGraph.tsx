import React from 'react';

import {Button} from "react-bootstrap";
import {BezierCurveAttributes} from "../object/AbstractJXGBezierCurve";
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import Slider from "../../../inputs/Slider";

class GraphExtrapolation extends BaseBezierCurveGraph<any, BaseGraphStates> {
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

    override presets() {
        return "bezier-extrapolation";
    }

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