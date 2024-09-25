import React, {useContext} from "react";
import {RefreshContext} from "../context/react/RefreshContext";
import ToolTippedButton from "../../inputs/ToolTippedButton";

export function ResetButton() {
    let refreshContext = useContext(RefreshContext);
    return refreshContext ?
        <ToolTippedButton tooltip={"Ponastavi prednastavitev"} onClick={refreshContext}>⭮</ToolTippedButton> : null;
}