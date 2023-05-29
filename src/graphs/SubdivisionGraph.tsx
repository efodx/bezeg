import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";

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
        this.board.unsuspendUpdate()
    };

    getGraphCommands(): JSX.Element[] {
        return [<Button text="Subdiviziraj" onClick={() => this.subdivide()}></Button>,
            <Button text="Prikaži kontrolne poligone" onClick={() => this.showControlPolygons()}></Button>,
            <Button text="Skrij kontrolne poligone" onClick={() => this.hideControlPolygons()}></Button>
        ]
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat([
            <Button text="Prikaži Decasteljau shemo"
                    onClick={() => this.showDecasteljauScheme()}></Button>,
            <Button text="Odstrani Decasteljau shemo"
                    onClick={() => this.hideDecasteljauScheme()}></Button>]);
    }

    private hideControlPolygons() {
        this.board.suspendUpdate()
        this.jsxBezierCurves.forEach(curve => curve.hideDecasteljauScheme())
        this.board.unsuspendUpdate()
    }

    private showControlPolygons() {
        this.board.suspendUpdate()
        this.jsxBezierCurves.forEach(curve => curve.showControlPolygon())
        this.board.unsuspendUpdate()
    }

    private showDecasteljauScheme() {
        this.board.suspendUpdate()
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().showDecasteljauSchemeForSlider(this.slider!)
        }
        this.board.unsuspendUpdate()
    }

    private hideDecasteljauScheme() {
        this.board.suspendUpdate()
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().hideDecasteljauScheme()
        }
        this.board.unsuspendUpdate()
    }
}

export default Graph;
