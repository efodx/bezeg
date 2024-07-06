import React, {useContext} from "react";
import {Button} from "react-bootstrap";
import {RefreshContext} from "../context/react/RefreshContext";

export function ResetButton() {
    let refreshContext = useContext(RefreshContext)
    return refreshContext ? <Button variant={"dark"} onClick={refreshContext}>Ponastavi</Button> : null
}