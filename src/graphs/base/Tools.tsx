import {Commands} from "./Commands";
import React from "react";

export function Tools({tools}: { tools: JSX.Element[] }) {
    return <Commands commands={tools} title={"Orodja"}></Commands>
}