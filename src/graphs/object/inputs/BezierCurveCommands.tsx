import Slider from "../../../inputs/Slider";
import {Button} from "react-bootstrap";
import React from "react";
import {JSXBezierCurve} from "../JSXBezierCurve";

export function BezierCurveCommands(curve: JSXBezierCurve): JSX.Element[] {
    const commands = []
    if (curve.getAttributes().allowSubdivision) {
        curve.createSubdivisionPoint()
        commands.push(<div onMouseEnter={() => curve.showSubdivisionPoint()}
                           onMouseLeave={() => curve.hideSubdivisionPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button onClick={() => curve.subdivide()}>Subdiviziraj</Button>
        </div>)
    }
    if (curve.getAttributes().allowExtrapolation) {
        curve.createExtrapolationPoint()
        commands.push(<div onMouseEnter={() => curve.showExtrapolationPoint()}
                           onMouseLeave={() => curve.hideExtrapolationPoint()}>
            <Slider min={1} max={1.5}
                    initialValue={curve.getExtrapolationT()}
                    onChange={(t) => curve.setExtrapolationT(t)}></Slider>
            <Button
                onClick={() => curve.extrapolate(curve.getExtrapolationT())}>Ekstrapoliraj</Button>
        </div>)
    }
    if (curve.getAttributes().allowShrink) {
        commands.push(<div onMouseEnter={() => curve.showCutPoint()}
                           onMouseLeave={() => curve.hideCutPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button onClick={() => curve.extrapolate(curve.getSubdivisionT())}>Skrči</Button>
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
        commands.push(<div onMouseEnter={() => curve.showElevatePoints()}
                           onMouseLeave={() => curve.hideElevatePoints()}>
            <Button onClick={() => curve.elevate()}>Dvigni stopnjo</Button></div>)
    }

    return commands;
}