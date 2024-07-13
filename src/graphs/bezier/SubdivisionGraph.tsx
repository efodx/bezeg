import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

function ShowControlPolygons(props: { onChange: (checked: boolean) => void }) {
    return <OnOffSwitch label="Kontrolni poligoni" onChange={props.onChange}/>
}

class SubdivisionGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private slider?: JXG.Slider;
    private stepsDone: number = 0;

    initialize() {
        const points = [[-4, -3], [-3, 2], [0, 3], [3, 2], [4, -3]]
        this.createJSXBezierCurve(points)
        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.5, 1]]);
        this.getFirstJsxCurve().showDecasteljauSchemeForSlider(this.slider)
        // this.createJSXGraphPoint(() => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).X(), () => this.bezierCurves[0].calculatePointAtT(this.slider!.Value()).Y());
    }

    override getAllJxgPoints() {
        return super.getAllJxgPoints().concat(this.jsxBezierCurves.flatMap(curve => curve.getJsxDecasteljauPoints()))
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
            <ShowControlPolygons onChange={(checked) => {
                if (checked) {
                    this.showControlPolygons()
                } else {
                    this.hideControlPolygons()
                }
            }}/>
        ])
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat([<OnOffSwitch
            initialState={this.getSelectedCurve().isShowingDecasteljauScheme()} onChange={checked => {
            if (checked) {
                this.showDecasteljauScheme()
            } else {
                this.hideDecasteljauScheme()
            }
        }} label={"Decasteljaujeva shema"}/>])
    }

    private hideControlPolygons() {
        this.board.suspendUpdate()
        this.jsxBezierCurves.forEach(curve => curve.hideDecasteljauScheme())
        this.jsxBezierCurves.forEach(curve => curve.hideControlPolygon())
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

export default SubdivisionGraph;
