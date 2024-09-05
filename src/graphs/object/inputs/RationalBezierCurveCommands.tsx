import {Button, ButtonGroup} from "react-bootstrap";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React, {useState} from "react";
import {JXGRationalBezierCurve} from ".././JXGRationalBezierCurve";
import {BezierCurveCommands} from "./BezierCurveCommands";
import {CacheContext} from "../../context/CacheContext";

function WeightController(props: { curve: JXGRationalBezierCurve }): JSX.Element {
    const [stateRefresher, setStateRefresher] = useState(1);
    const refreshState = () => {
        setStateRefresher(stateRefresher + 1);
        CacheContext.update();
        props.curve.board.update();
    };
    return <ButtonGroup key={stateRefresher} vertical={true}>
        <Button className="btn-block" onClick={() => {
            props.curve.changeWeight(0.25);
            refreshState();
        }}>+</Button>
        <ButtonGroup>
            <Button className="btn-block" onClick={() => {
                props.curve.prevWeight();
                refreshState();
            }}>{"<"}</Button>
            <Button variant="light" onClick={() => {
                props.curve.resetWeight();
                refreshState();
            }}
                    className="btn-block">{props.curve.getCurrentWeight().toFixed(2)}</Button>
            <Button onClick={() => {
                props.curve.nextWeight();
                refreshState();
            }} className="btn-block">{">"}</Button>
        </ButtonGroup> <Button onClick={() => {
        props.curve.changeWeight(-0.25);
        refreshState();
    }}
                               className="btn-block">-</Button>
    </ButtonGroup>;
}

export function RationalBezierCurveCommands(curve: JXGRationalBezierCurve): JSX.Element[] {
    const commands = BezierCurveCommands(curve as any);
    commands.push(<div>
        <OnOffSwitch initialState={curve.isShowingWeights()}
                     onChange={(checked) => curve.showwWeights(checked)} label={"Uteži"}/>
        <WeightController curve={curve}></WeightController>
        <OnOffSwitch initialState={curve.inStandardForm()}
                     onChange={(checked) => curve.setStandardForm(checked)} label={"Standardna Forma"}/>

    </div>);
    return commands;
}