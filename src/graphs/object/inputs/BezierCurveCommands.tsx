import Slider from "../../../inputs/Slider";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React from "react";
import {JSXBezierCurve} from "../JSXBezierCurve";

function ShowControlPoints(props: { initialState?: boolean, onChange: (checked: boolean) => void }) {
    return <OnOffSwitch initialState={props.initialState} onChange={props.onChange} label="Kontrolne točke"/>
}

export function BezierCurveCommands(curve: JSXBezierCurve): JSX.Element[] {
    curve.createSubdivisionPoint()
    curve.createExtrapolationPoint()
    const commands = []
    if (curve.getAttributes().allowSubdivision) {
        commands.push(<div onMouseEnter={() => curve.showSubdivisionPoint()}
                           onMouseLeave={() => curve.hideSubdivisionPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button variant={"dark"} onClick={() => curve.subdivide()}>Subdiviziraj</Button>
        </div>)
    }
    if (curve.getAttributes().allowExtrapolation) {
        commands.push(<div onMouseEnter={() => curve.showExtrapolationPoint()}
                           onMouseLeave={() => curve.hideExtrapolationPoint()}>
            <Slider min={1} max={1.5}
                    initialValue={curve.getExtrapolationT()}
                    onChange={(t) => curve.setExtrapolationT(t)}></Slider>
            <Button variant={"dark"}
                    onClick={() => curve.extrapolate(curve.getExtrapolationT())}>Ekstrapoliraj</Button>
        </div>)
    }
    if (curve.getAttributes().allowShrink) {
        commands.push(<div onMouseEnter={() => curve.showSubdivisionPoint()}
                           onMouseLeave={() => curve.hideSubdivisionPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button variant={"dark"} onClick={() => curve.extrapolate(curve.getSubdivisionT())}>Skrči</Button>
        </div>)
    }
    if (curve.getAttributes().allowDecasteljau) {
        commands.push(<div onMouseEnter={() => curve.showCurrentDecasteljauScheme()}
                           onMouseLeave={() => curve.hideDecasteljauScheme()}>
            <Slider min={0} max={1}
                    initialValue={curve.getDecasteljauT()}
                    onChange={(t) => curve.setDecasteljauT(t)}></Slider>
        </div>)
    }
    if (curve.getAttributes().allowElevation) {
        commands.push(<div>
            <Button variant={"dark"} onClick={() => curve.elevate()}>Dvigni stopnjo</Button></div>)
    }
    if (curve.getAttributes().allowShowPoints) {
        commands.push(<ShowControlPoints
            initialState={curve.isShowingJxgPoints()}
            onChange={checked => curve.showJxgPointss(checked)}/>)
    }
    commands.push(<OnOffSwitch label={"Konveksna ovojnica"}
                               initialState={curve.isShowingConvexHull()}
                               onChange={(checked) => curve.showConvexHull(checked)}></OnOffSwitch>)
    return commands;
}