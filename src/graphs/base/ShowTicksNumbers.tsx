import {Board} from "jsxgraph";
import React from "react";
import {VisibilityContext} from "../context/VisibilityContext";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

export function ShowTicksNumbers(props: { board: () => Board }) {
    return <OnOffSwitch
        initialState={VisibilityContext.tickNumbersVisibility}
        onChange={(checked) => {
            VisibilityContext.setTickNumberVisibility(checked)
            props.board().fullUpdate()
        }} label={"Oštevilčenje"}/>
}