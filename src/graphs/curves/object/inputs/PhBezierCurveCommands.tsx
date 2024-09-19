import {Button} from "react-bootstrap";
import React, {useState} from "react";
import {JXGPHBezierCurve} from "../JXGPHBezierCurve";
import {OnOffSwitch} from "../../../../inputs/OnOffSwitch";
import Slider from "../../../../inputs/Slider";


interface OffsetCurveSettingsProps {
    curve: JXGPHBezierCurve
}

function OffsetCurveSettings({curve}: OffsetCurveSettingsProps) {
    const [showOffsetCurve, setShowOffsetCurve] = useState(curve.isShowingOffsetCurve());
    const [showOffSetCurveControlPoints, setShowOffSetCurveControlPoints] = useState(curve.isShowingOffsetCurveControlPoints());
    const [showOffSetCurveControlPointsLines, setShowOffSetCurveControlPointsLines] = useState(curve.isShowingOffsetCurveControlPointsLines());

    return <div>
        <OnOffSwitch
            initialState={curve.isShowingOffsetCurve()}
            onChange={checked => {
                curve.setShowOffsetCurve(checked);
                setShowOffsetCurve(checked);
            }}
            label={"Odmiki krivulje"}/>
        {showOffsetCurve && <div>
          <Slider min={-3}
                  max={3}
                  initialValue={curve.getCurve().getOffsetCurveDistance()}
                  step={0.1}
                  onChange={e => curve.setOffsetCurveDistance(e)}/>
          <OnOffSwitch
            onChange={checked => {
                curve.setShowOffsetCurveControlPoints(checked);
                setShowOffSetCurveControlPoints(checked);
            }}
            label={"Kontrolne točke offset krivulje"}
            initialState={showOffSetCurveControlPoints}/>
          <OnOffSwitch
            disabled={!showOffSetCurveControlPoints}
            onChange={checked => {
                curve.setShowOffsetCurveControlPointsLines(checked);
                setShowOffSetCurveControlPointsLines(checked);
            }}
            label={"Premice kontrolnih točke offset krivulje"}
            initialState={showOffSetCurveControlPointsLines}/>
          <Button onClick={() => curve.addOffsetCurve()}>Dodaj
            krivuljo</Button>
          <Button onClick={() => curve.removeOffsetCurve()}>Odstrani
            krivuljo</Button></div>}
    </div>;
}

export function PhBezierCurveCommands(curve: JXGPHBezierCurve): JSX.Element[] {
    const commands = [];
    commands.push(<OffsetCurveSettings curve={curve}></OffsetCurveSettings>);
    return commands;
}