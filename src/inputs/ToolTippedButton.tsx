import React from "react";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    tooltip: string;
    disabled?: boolean;
}

export default function ToolTippedButton(props: React.PropsWithChildren<ButtonProps>) {
    const tooltip = (ps: any) => <Tooltip
        id={"button-tooltip" + Math.random()} {...ps}>
        {props.tooltip}
    </Tooltip>;

    return <OverlayTrigger overlay={tooltip}
                           placement="top"
                           delay={{show: 700, hide: 200}}>
        <Button disabled={props.disabled} onClick={(event) => props.onClick(event)}>
            {props.children}
        </Button>
    </OverlayTrigger>;
}