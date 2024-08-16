import Slider from "../../../inputs/Slider";
import {Button} from "react-bootstrap";
import React from "react";
import {JSXBezierCurve} from "../JSXBezierCurve";
import {CacheContext} from "../../context/CacheContext";

export function BezierCurveCommands(curve: JSXBezierCurve): JSX.Element[] {
    const commands = []
    if (curve.getAttributes().allowSubdivision) {
        curve.createSubdivisionPoint()
        commands.push(<div onMouseEnter={() => curve.showSubdivisionPoint()}
                           onMouseLeave={() => curve.hideSubdivisionPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button onClick={() => {
                curve.subdivide()
                CacheContext.update()
                curve.board.update()
            }}>Subdiviziraj</Button>
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
                onClick={() => {
                    curve.extrapolate(curve.getExtrapolationT())
                    CacheContext.update()
                    curve.board.update()
                }}>Ekstrapoliraj</Button>
        </div>)
    }
    if (curve.getAttributes().allowShrink) {
        commands.push(<div onMouseEnter={() => curve.showCutPoint()}
                           onMouseLeave={() => curve.hideCutPoint()}>
            <Slider min={0} max={1}
                    initialValue={curve.getSubdivisionT()}
                    onChange={(t) => curve.setSubdivisionT(t)}></Slider>
            <Button onClick={() => {
                curve.extrapolate(curve.getSubdivisionT())
                CacheContext.update()
                curve.board.update()
            }}>Skrči</Button>
        </div>)
    }
    if (curve.getAttributes().allowDecasteljau) {
        commands.push(<div onMouseEnter={() => curve.showCurrentDecasteljauScheme()}
                           onMouseLeave={() => curve.hideDecasteljauScheme()}>
            <Slider min={0} max={1}
                    initialValue={curve.getDecasteljauT()}
                    onChange={(t) => {
                        curve.setDecasteljauT(t)
                        CacheContext.update()
                        curve.board.update()
                    }}></Slider>
        </div>)
    }
    if (curve.getAttributes().allowElevation) {
        commands.push(<div onMouseEnter={() => curve.showElevatePoints()}
                           onMouseLeave={() => curve.hideElevatePoints()}>
            <Button onClick={() => {
                curve.elevate()
                CacheContext.update()
                curve.board.update()
            }}>Dvigni stopnjo</Button></div>)
    }

    return commands;
}