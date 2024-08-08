import {Board} from "jsxgraph";
import React from "react";
import {VisibilityContext} from "../context/VisibilityContext";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

export function ShowTicks(props: { board: () => Board }) {
    return <OnOffSwitch
        initialState={VisibilityContext.ticksVisibility}
        onChange={(checked) => {
            VisibilityContext.setTicksVisibility(checked)
            props.board().fullUpdate()
        }} label={"Vmesne črte"}/>
}