import {Button, ButtonGroup} from "react-bootstrap";
import React from "react";

export function CountSetter(props: {
    onPlus: () => void,
    onCenter: () => number,
    n: number,
    onMinus: () => void,
    min?: number,
    max?: number
}) {
    const onPlus = () => {
        if (props.n === props.max) {
            return;
        }
        props.onPlus();
    };

    const onMinus = () => {
        if (props.n === props.min) {
            return;
        }
        props.onMinus();
    };

    return <ButtonGroup>
        <Button className="btn-block"
                onClick={onPlus}>+</Button>
        <Button variant="light" onClick={props.onCenter}
                className="btn-block">{props.n}</Button>
        <Button onClick={onMinus}
                className="btn-block">-</Button>
    </ButtonGroup>;
}