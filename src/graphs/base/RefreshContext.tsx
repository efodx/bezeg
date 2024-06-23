import React, {useContext} from "react";
import {RefreshContext} from "../../Contexts";
import {Button} from "react-bootstrap";

export function ResetButton() {
    let refreshContext = useContext(RefreshContext)
    return refreshContext ? <Button variant={"dark"} onClick={refreshContext}>Ponastavi</Button> : null
}