import React from 'react';

import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {JXGBezierCurve} from "../object/JXGBezierCurve";
import {Attributes} from "../attributes/Attributes";

function ShowControlPolygons(props: { initialState: boolean, onChange: (checked: boolean) => void }) {
    return <OnOffSwitch initialState={props.initialState} label="Kontrolni poligoni" onChange={props.onChange}/>;
}

class SubdivisionGraph extends BaseBezierCurveGraph<any, BaseGraphStates> {
    private stepsDone: number = 0;

    override initialize() {
        super.initialize();
        this.getFirstJxgCurve().setAttributes(Attributes.bezierDisabled);
    }

    defaultPreset(): any {
        return [["JSXBezierCurve", {
            "points": [[-4, -3], [-3, 2], [2, 2], [3, -2]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": true,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2
            }
        }]];
    }

    override presets() {
        return "bezier-subdivision";
    }

    override getAllJxgPoints() {
        return super.getAllJxgPoints().concat(this.jxgCurves.flatMap(curve => (curve as JXGBezierCurve).getJXGDecasteljauPoints()));
    }

    subdivide() {
        if (this.stepsDone > 4) {
            return;
        }
        this.stepsDone = this.stepsDone + 1;
        // @ts-ignore
        this.board.suspendUpdate();
        let oldJsxBezierCurves = this.jxgCurves.map(c => c as JXGBezierCurve);
        for (let bezierCurve of oldJsxBezierCurves) {
            let newCurve = bezierCurve.subdivide(1 / 2);
            bezierCurve.hideDecasteljauScheme();
            bezierCurve.showControlPolygon();
            newCurve.showControlPolygon();

            this.jxgCurves.push(newCurve);
        }
        this.unsuspendBoardUpdate();
    };

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([<Button
            onClick={() => this.subdivide()}>Subdiviziraj</Button>,
            <ShowControlPolygons initialState={this.getFirstJxgCurve().isShowingControlPolygon()}
                                 onChange={(checked) => {
                                     if (checked) {
                                         this.showControlPolygons();
                                     } else {
                                         this.hideControlPolygons();
                                     }
                                 }}/>]) : [];
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat([<OnOffSwitch
            initialState={this.getSelectedCurve().isShowingDecasteljauScheme()} onChange={checked => {
            if (checked) {
                this.showDecasteljauScheme();
            } else {
                this.hideDecasteljauScheme();
            }
        }} label={"Decasteljaujeva shema"}/>]);
    }

    private hideControlPolygons() {
        this.board.suspendUpdate();
        this.jxgCurves.forEach(curve => (curve as JXGBezierCurve).hideDecasteljauScheme());
        this.jxgCurves.forEach(curve => curve.hideControlPolygon());
        this.unsuspendBoardUpdate();
    }

    private showControlPolygons() {
        this.board.suspendUpdate();
        this.jxgCurves.forEach(curve => curve.showControlPolygon());
        this.unsuspendBoardUpdate();
    }

    private showDecasteljauScheme() {
        this.board.suspendUpdate();
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().setDecasteljauT(1 / 2);
        }
        this.unsuspendBoardUpdate();
    }

    private hideDecasteljauScheme() {
        this.board.suspendUpdate();
        if (this.getSelectedCurve()) {
            this.getSelectedCurve().hideDecasteljauScheme();
        }
        this.unsuspendBoardUpdate();
    }
}

export default SubdivisionGraph;
