import {Board} from "jsxgraph";
import React from "react";
import {VisibilityContext} from "../context/VisibilityContext";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

export function ShowAxis(props: { board: () => Board }) {
    return <OnOffSwitch
        initialState={VisibilityContext.axisVisibility}
        onChange={(checked) => {
            VisibilityContext.setAxisVisible(checked)
            props.board().fullUpdate()
        }} label={"Mreža"}/>
}