import React from 'react';
import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import Slider from "../../inputs/Slider";
import {BezierCurveAttributes} from "../object/AbstractJSXBezierCurve";

class GraphExtrapolation extends BaseRationalCurveGraph<any, BaseGraphStates> {
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

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,5,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier-extrapolation"
    }


}

export default GraphExtrapolation;
