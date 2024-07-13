import Slider from "../../../inputs/Slider";
import {Button, ButtonGroup} from "react-bootstrap";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React, {useState} from "react";
import {JSXRationalBezierCurve} from "../JSXRationalBezierCurve";

function WeightController(props: { curve: JSXRationalBezierCurve }): JSX.Element {
    const [stateRefresher, setStateRefresher] = useState(1)
    return <ButtonGroup key={stateRefresher} vertical={true}>
        <Button variant={"dark"} className="btn-block" onClick={() => {
            props.curve.changeWeight(0.25)
            setStateRefresher(stateRefresher + 1)
        }}>+</Button>
        <ButtonGroup>
            <Button variant={"dark"} className="btn-block" onClick={() => {
                props.curve.prevWeight()
                setStateRefresher(stateRefresher + 1)
            }}>{"<"}</Button>
            <Button onClick={() => {
                props.curve.resetWeight()
                setStateRefresher(stateRefresher + 1)
            }}
                    className="btn-block">{props.curve.getCurrentWeight().toFixed(2)}</Button>
            <Button variant={"dark"} onClick={() => {
                props.curve.nextWeight()
                setStateRefresher(stateRefresher + 1)
            }} className="btn-block">{">"}</Button>
        </ButtonGroup> <Button variant={"dark"} onClick={() => {
        props.curve.changeWeight(-0.25)
        setStateRefresher(stateRefresher + 1)
    }}
                               className="btn-block">-</Button>
    </ButtonGroup>;
}

export function RationalBezierCurveCommands(curve: JSXRationalBezierCurve): JSX.Element[] {
    curve.createSubdivisionPoint()
    curve.createExtrapolationPoint()
    return [
        <div onMouseEnter={() => curve.showSubdivisionPoint()}
             onMouseLeave={() => curve.hideSubdivisionPoint()}><Slider min={0} max={1}
                                                                       initialValue={curve.subdivisionT}
                                                                       onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button variant={"dark"} onClick={() => curve.subdivideSelectedCurve()}>Subdiviziraj</Button></div>,
        <div onMouseEnter={() => curve.showExtrapolationPoint()}
             onMouseLeave={() => curve.hideExtrapolationPoint()}>
            <Slider min={1} max={1.5}
                    initialValue={curve.extrapolationT}
                    onChange={(t) => curve.setExtrapolationT(t)}></Slider>
            <Button variant={"dark"} onClick={() => curve.extrapolateSelectedCurve()}>Ekstrapoliraj</Button></div>,
        <div>
            <Button variant={"dark"} onClick={() => curve.elevateSelectedCurve()}>Dvigni stopnjo</Button></div>,

        <div>
            <OnOffSwitch initialState={curve.isShowingWeights()}
                         onChange={(checked) => curve.showwWeights(checked)} label={"Uteži"}/>
            <WeightController curve={curve}></WeightController>
            <OnOffSwitch initialState={curve.inStandardForm()}
                         onChange={(checked) => curve.setStandardForm(checked)} label={"Standardna Forma"}/>

        </div>
    ]
}