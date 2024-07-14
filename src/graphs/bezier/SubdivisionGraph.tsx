import React from 'react';
import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {JSXBezierCurve} from "../object/JSXBezierCurve";
import {Attributes} from "../attributes/Attributes";

function ShowControlPolygons(props: { onChange: (checked: boolean) => void }) {
    return <OnOffSwitch label="Kontrolni poligoni" onChange={props.onChange}/>
}

class SubdivisionGraph extends BaseBezierCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    private stepsDone: number = 0;

    override initialize() {
        super.initialize();
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
    }

    defaultPreset() {
        return '["JSXBezierCurve|{\\"points\\":[[-4,-3],[-3,2],[2,2],[3,-2]],\\"state\\":{\\"showingJxgPoints\\":true,\\"showingControlPolygon\\":true,\\"showingConvexHull\\":false,\\"showingDecasteljauScheme\\":false,\\"subdivisionT\\":0.5,\\"decasteljauT\\":0.5,\\"extrapolationT\\":1.2}}"]'
    }

    override presets() {
        return "bezier-subdivision"
    }

    override getAllJxgPoints() {
        return super.getAllJxgPoints().concat(this.jsxBezierCurves.flatMap(curve => (curve as JSXBezierCurve).getJsxDecasteljauPoints()))
    }

    subdivide() {
        if (this.stepsDone > 4) {
            return
        }
        this.stepsDone = this.stepsDone + 1
        // @ts-ignore
        this.board.suspendUpdate()
        let oldJsxBezierCurves = this.jsxBezierCurves.map(c => c as JSXBezierCurve)
        for (let bezierCurve of oldJsxBezierCurves) {
            let newCurve = bezierCurve.subdivide(1 / 2)
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
        this.jsxBezierCurves.forEach(curve => (curve as JSXBezierCurve).hideDecasteljauScheme())
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
            this.getSelectedCurve().showDecasteljauSchemeForT(1 / 2)
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
