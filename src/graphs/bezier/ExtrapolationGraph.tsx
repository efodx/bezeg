import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import Slider from "../../inputs/Slider";
import {BezierCurveAttributes} from "../object/AbstractJSXBezierCurve";

class GraphExtrapolation extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    defaultPreset() {
        return "[\"JSXBezierCurve|{\\\"points\\\":[[-4,-3],[-3,2],[2,2],[3,-2]]}\"]"
    }

    override presets() {
        return "bezier-extrapolation"
    }

    override initialize() {
        super.initialize()
        this.getFirstJsxCurve().createExtrapolationPoint()
        this.getFirstJsxCurve().showExtrapolationPoint()
        this.getFirstJsxCurve().setAttributes({
            allowShrink: false,
            allowExtrapolation: false,
            allowElevation: false,
            allowDecasteljau: false,
            allowSubdivision: false
        } as BezierCurveAttributes)
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<div>
            <Slider min={1} max={1.5}
                    initialValue={this.getFirstJsxCurve().getExtrapolationT()}
                    onChange={(t) => this.getFirstJsxCurve().setExtrapolationT(t)}></Slider>
            <Button variant={"dark"}
                    onClick={() => this.getFirstJsxCurve().extrapolate(this.getFirstJsxCurve().getExtrapolationT())}>Ekstrapoliraj</Button>
        </div>]) : []
    }
}

export default GraphExtrapolation;