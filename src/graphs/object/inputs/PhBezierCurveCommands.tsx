import Slider from "../../../inputs/Slider";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React, {useState} from "react";
import {JSXPHBezierCurve} from "../JSXPHBezierCurve";


interface OffsetCurveSettingsProps {
    curve: JSXPHBezierCurve
}

function OffsetCurveSettings({curve}: OffsetCurveSettingsProps) {
    const [showOffsetCurve, setShowOffsetCurve] = useState(curve.isShowingOffsetCurve())
    console.log('lolol', curve.isShowingOffsetCurveControlPoints())
    console.log("lololwataf", curve.isShowingOffsetCurveControlPointsLines())
    const [showOffSetCurveControlPoints, setShowOffSetCurveControlPoints] = useState(curve.isShowingOffsetCurveControlPoints())
    const [showOffSetCurveControlPointsLines, setShowOffSetCurveControlPointsLines] = useState(curve.isShowingOffsetCurveControlPointsLines())

    return <div>
        <OnOffSwitch
            initialState={curve.isShowingOffsetCurve()}
            onChange={checked => {
                curve.setShowOffsetCurve(checked)
                setShowOffsetCurve(checked)
            }}
            label={"Offset krivulje"}/>
        {showOffsetCurve && <div>
          <Slider min={-3}
                  max={3}
                  initialValue={curve.getCurve().getOffsetCurveDistance()}
                  step={0.1}
                  onChange={e => curve.setOffsetCurveDistance(e)}/>
          <OnOffSwitch
            onChange={checked => {
                curve.setShowOffsetCurveControlPoints(checked)
                setShowOffSetCurveControlPoints(checked)
            }}
            label={"Kontrolne točke offset krivulje"}
            initialState={showOffSetCurveControlPoints}/>
          <OnOffSwitch
            disabled={!showOffSetCurveControlPoints}
            onChange={checked => {
                curve.setShowOffsetCurveControlPointsLines(checked)
                setShowOffSetCurveControlPointsLines(checked)
            }}
            label={"Premice kontrolnih točke offset krivulje"}
            initialState={showOffSetCurveControlPointsLines}/>
          <Button variant={"dark"} onClick={() => curve.addOffsetCurve()}>Dodaj
            krivuljo</Button>
          <Button variant={"dark"} onClick={() => curve.removeOffsetCurve()}>Odstrani
            krivuljo</Button></div>}
    </div>;
}

export function PhBezierCurveCommands(curve: JSXPHBezierCurve): JSX.Element[] {
    const commands = []
    commands.push(<OffsetCurveSettings curve={curve}></OffsetCurveSettings>)
    return commands;
}