import React from 'react';
import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {Button, Form} from "react-bootstrap";

class Graph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider: JXG.Slider | undefined;
    private stepsDone: number = 0;

    initialize() {
        const points = [[-4, -3], [-3, 2], [0, 3], [3, 2], [4, -3]]
        this.createJSXBezierCurve(points)
        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.5, 1]]);
        this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
        // this.createJSXGraphPoint(() => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).X(), () => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).Y());
    }

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        // @ts-ignore
        this.board.suspendUpdate()
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c)
        for (let bezierCurve of oldJsxBezierCurves) {
            let newCurve = bezierCurve.subdivide(this.slider!.Value())
            bezierCurve.hideDecasteljauScheme()
            bezierCurve.showControlPolygon()
            newCurve.showControlPolygon()

            this.jsxBezierCurves.push(newCurve);
        }
        this.unsuspendBoardUpdate()
    };

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<Button variant={"dark"}
                                                        onClick={() => this.subdivide()}>Subdiviziraj</Button>,
            <Form> <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Prikaži kontrolne poligone"
                checked={this.getFirstJsxCurve()?.isShowingControlPolygon()}
                onChange={(e) => {
                    console.log("lol")
                    this.hideControlPolygons()
                }}/>
            </Form>,
            <Button variant={"dark"} onClick={() => this.showControlPolygons()}>Prikaži kontrolne poligone</Button>,
            <Button variant={"dark"} onClick={() => this.hideControlPolygons()}>Skrij kontrolne poligone</Button>
        ])
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat([
            <Button variant={"dark"} onClick={() => this.showDecasteljauScheme()}>Prikaži Decasteljau shemo</Button>,
            <Button variant={"dark"} onClick={() => this.hideDecasteljauScheme()}>Odstrani Decasteljau shemo</Button>]);
    }

    private hideControlPolygons() {
        this.board.suspendUpdate()
        this.jsxBezierCurves.forEach(curve => curve.hideDecasteljauScheme())
        this.unsuspendBoardUpdate()
    }

    private showControlPolygons() {
        this.board.suspendUpdate()
        this.jsxBezierCurves.forEach(curve => curve.showControlPolygon())
        this.unsuspendBoardUpdate()
    }

    private showDecasteljauScheme() {
        this.board.suspendUpdate()
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().showDecasteljauSchemeForSlider(this.slider!)
        }
        this.unsuspendBoardUpdate()
    }

    private hideDecasteljauScheme() {
        this.board.suspendUpdate()
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().hideDecasteljauScheme()
        }
        this.unsuspendBoardUpdate()
    }
}

export default Graph;
