import {Board} from "jsxgraph";
import React from "react";
import {VisibilityContext} from "../context/VisibilityContext";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

export function ShowMinorTicks(props: { board: () => Board }) {
    return <OnOffSwitch
        initialState={VisibilityContext.axisVisibility}
        onChange={(checked) => {
            VisibilityContext.setMinorVisible(checked)
            props.board().fullUpdate()
        }} label={"Črtice"}/>
}