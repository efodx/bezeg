import {AbstractJSXPointControlledCurve, PointControlledCurveAttributes} from "../AbstractJSXPointControlledCurve";
import {PointControlledCurve} from "../../../bezeg/api/curve/point-controlled-curve";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import React from "react";

export function ShowControlPolygon(curve: AbstractJSXPointControlledCurve<any, any>) {
    return <OnOffSwitch initialState={curve.isShowingControlPolygon()}
                        onChange={(e) => curve.showControllPolygon(e)}
                        label={"Kontrolni poligon"}></OnOffSwitch>;
}

export function ShowConvexHull(curve: AbstractJSXPointControlledCurve<any, any>) {
    return <OnOffSwitch initialState={curve.isShowingConvexHull()}
                        onChange={(e) => curve.showConvexHull(e)}
                        label={"Konveksna ovojnica"}></OnOffSwitch>;
}

function ShowControlPoints(props: { initialState?: boolean, onChange: (checked: boolean) => void }) {
    return <OnOffSwitch initialState={props.initialState} onChange={props.onChange} label="Kontrolne točke"/>;
}

export function PointControlledCurveCommands(curve: AbstractJSXPointControlledCurve<PointControlledCurve, PointControlledCurveAttributes>): JSX.Element[] {
    let {allowShowControlPolygon, allowShowConvexHull} = curve.getAttributes();
    const commands = [];
    if (allowShowControlPolygon) {
        commands.push(ShowControlPolygon(curve));
    }
    if (allowShowConvexHull) {
        commands.push(ShowConvexHull(curve));
    }
    if (curve.getAttributes().allowShowPoints) {
        commands.push(<ShowControlPoints
            initialState={curve.isShowingJxgPoints()}
            onChange={checked => curve.showJxgPointss(checked)}/>);
    }

    return commands;
}