import React, {useState} from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Button, ButtonGroup} from "react-bootstrap";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {range} from "../../utils/Range";
import {JSXSplineCurve} from "../object/JSXSplineCurve";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";

function WeightController(props: { curve: JSXRationalBezierCurve }): JSX.Element {
    const [stateRefresher, setStateRefresher] = useState(1);
    return <ButtonGroup key={stateRefresher} vertical={true}>
        <Button className="btn-block" onClick={() => {
            props.curve.changeWeight(0.25);
            setStateRefresher(stateRefresher + 1);
        }}>+</Button>
        <ButtonGroup>
            <Button className="btn-block" onClick={() => {
                props.curve.prevWeight();
                setStateRefresher(stateRefresher + 1);
            }}>{"<"}</Button>
            <Button variant="light" onClick={() => {
                props.curve.resetWeight();
                setStateRefresher(stateRefresher + 1);
            }}
                    className="btn-block">{props.curve.getCurrentWeight().toFixed(2)}</Button>
            <Button onClick={() => {
                props.curve.nextWeight();
                setStateRefresher(stateRefresher + 1);
            }} className="btn-block">{">"}</Button>
        </ButtonGroup> <Button onClick={() => {
        props.curve.changeWeight(-0.25);
        setStateRefresher(stateRefresher + 1);
    }}
                               className="btn-block">-</Button>
    </ButtonGroup>;
}

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(this.getBiSetters()
        ) : [];
    }

    defaultPreset(): any {
        return [["JSXSplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2]], "degree": 3, "continuity": 2, "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override presets(): string {
        return "g1-spline-graph";
    }

    private getBiSetters() {
        return range(1, this.getFirstCurve().getNumOfBs(), 1).map(
            i => <div><Button onClick={() => this.povecajBi(i - 1)}>Povečaj B{i}</Button>
                <Button onClick={() => this.zmanjsajBi(i - 1)}>Zmanjšaj B{i}</Button></div>
        );
    }

    private povecajBi(i: number) {
        this.getFirstCurve().setB(i, this.getFirstCurve().getB(i) * 1.1);
        this.boardUpdate();
    }

    private zmanjsajBi(i: number) {
        this.getFirstCurve().setB(i, this.getFirstCurve().getB(i) * 0.9);
        this.boardUpdate();
    }


}

export default Graph;
