import {Button, ButtonGroup} from "react-bootstrap";
import React, {useState} from "react";

export function CountSetter(props: {
    onPlus: () => void,
    onCenter: () => number,
    n: number,
    onMinus: () => void,
    min?: number | (() => number),
    max?: number | (() => number)
}) {
    const [n, setN] = useState(props.n);
    const onPlus = () => {
        if (n === props.max) {
            return;
        }
        if (typeof props.max == 'function' && n === props.max()) {
            return;
        }
        props.onPlus();
        setN(n + 1);
    };

    const onMinus = () => {
        if (n === props.min) {
            return;
        }
        if (typeof props.min == 'function' && n === props.min()) {
            return;
        }
        props.onMinus();
        setN(n - 1);
    };

    return <ButtonGroup>
        <Button className="btn-block"
                onClick={onPlus}>+</Button>
        <Button variant="light" onClick={props.onCenter}
                className="btn-block">{n}</Button>
        <Button onClick={onMinus}
                className="btn-block">-</Button>
    </ButtonGroup>;
}