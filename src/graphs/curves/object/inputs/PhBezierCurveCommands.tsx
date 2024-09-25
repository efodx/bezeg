import React, {useState} from "react";
import {JXGPHBezierCurve} from "../JXGPHBezierCurve";
import {OnOffSwitch} from "../../../../inputs/OnOffSwitch";
import Slider from "../../../../inputs/Slider";
import {CountSetter} from "../../../../inputs/CountSetter";


interface OffsetCurveSettingsProps {
    curve: JXGPHBezierCurve
}

function OffsetCurveSettings({curve}: OffsetCurveSettingsProps) {
    const [showOffsetCurve, setShowOffsetCurve] = useState(curve.isShowingOffsetCurve());
    const [showOffSetCurveControlPoints, setShowOffSetCurveControlPoints] = useState(curve.isShowingOffsetCurveControlPoints());
    const [showOffSetCurveControlPointsLines, setShowOffSetCurveControlPointsLines] = useState(curve.isShowingOffsetCurveControlPointsLines());
    const [numberOfCurves, setNumberOfCurves] = useState(curve.getNumberOfOffsetCurves());
    return <div>
        <OnOffSwitch
            initialState={curve.isShowingOffsetCurve()}
            onChange={checked => {
                curve.setShowOffsetCurve(checked);
                setShowOffsetCurve(checked);
                if (!checked) {
                    curve.setShowOffsetCurveControlPoints(false);
                    setShowOffSetCurveControlPoints(false);
                    curve.setShowOffsetCurveControlPointsLines(false);
                    setShowOffSetCurveControlPointsLines(false);
                }
            }}
            label={"Odmiki krivulje"}/>
        {showOffsetCurve && <div key={showOffsetCurve + ""}>
          <div>
            <div>Število odmikov</div>
            <CountSetter onPlus={() => {
                curve.addOffsetCurve();
                setNumberOfCurves(numberOfCurves + 1);
            }} onCenter={() => 1} n={numberOfCurves}
                         onMinus={() => {
                             curve.removeOffsetCurve();
                             setNumberOfCurves(numberOfCurves - 1);
                         }}
                         min={1}
            ></CountSetter></div>
          <Slider min={-3}
                  max={3}
                  initialValue={curve.getCurve().getOffsetCurveDistance()}
                  step={0.1}
                  onChange={e => curve.setOffsetCurveDistance(e)}/>
          <OnOffSwitch
            onChange={checked => {
                curve.setShowOffsetCurveControlPoints(checked);
                setShowOffSetCurveControlPoints(checked);
                if (!checked) {
                    console.log("setting no lines bby");
                    curve.setShowOffsetCurveControlPointsLines(false);
                    setShowOffSetCurveControlPointsLines(false);
                }
            }}
            label={"Kontrolne točke odmikov krivulje"}
            initialState={showOffSetCurveControlPoints}/>
          <OnOffSwitch
            key={"" + !showOffSetCurveControlPoints}
            disabled={!showOffSetCurveControlPoints}
            onChange={checked => {
                curve.setShowOffsetCurveControlPointsLines(checked);
                setShowOffSetCurveControlPointsLines(checked);
            }}
            label={"Premice kontrolnih točk odmikov krivulje"}
            initialState={showOffSetCurveControlPointsLines}/>
        </div>
        }
    </div>;
}

export function PhBezierCurveCommands(curve: JXGPHBezierCurve): JSX.Element[] {
    const commands = [];
    commands.push(<OffsetCurveSettings curve={curve}></OffsetCurveSettings>);
    return commands;
}