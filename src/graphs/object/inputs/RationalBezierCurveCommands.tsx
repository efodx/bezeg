import {Button, ButtonGroup} from "react-bootstrap";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React, {useState} from "react";
import {JSXRationalBezierCurve} from "../JSXRationalBezierCurve";
import {BezierCurveCommands} from "./BezierCurveCommands";

function WeightController(props: { curve: JSXRationalBezierCurve }): JSX.Element {
    const [stateRefresher, setStateRefresher] = useState(1)
    return <ButtonGroup key={stateRefresher} vertical={true}>
        <Button className="btn-block" onClick={() => {
            props.curve.changeWeight(0.25)
            setStateRefresher(stateRefresher + 1)
        }}>+</Button>
        <ButtonGroup>
            <Button className="btn-block" onClick={() => {
                props.curve.prevWeight()
                setStateRefresher(stateRefresher + 1)
            }}>{"<"}</Button>
            <Button variant="light" onClick={() => {
                props.curve.resetWeight()
                setStateRefresher(stateRefresher + 1)
            }}
                    className="btn-block">{props.curve.getCurrentWeight().toFixed(2)}</Button>
            <Button onClick={() => {
                props.curve.nextWeight()
                setStateRefresher(stateRefresher + 1)
            }} className="btn-block">{">"}</Button>
        </ButtonGroup> <Button onClick={() => {
        props.curve.changeWeight(-0.25)
        setStateRefresher(stateRefresher + 1)
    }}
                               className="btn-block">-</Button>
    </ButtonGroup>;
}

export function RationalBezierCurveCommands(curve: JSXRationalBezierCurve): JSX.Element[] {
    const commands = BezierCurveCommands(curve as any);
    commands.push(<div>
        <OnOffSwitch initialState={curve.isShowingWeights()}
                     onChange={(checked) => curve.showwWeights(checked)} label={"Uteži"}/>
        <WeightController curve={curve}></WeightController>
        <OnOffSwitch initialState={curve.inStandardForm()}
                     onChange={(checked) => curve.setStandardForm(checked)} label={"Standardna Forma"}/>

    </div>)
    return commands
}