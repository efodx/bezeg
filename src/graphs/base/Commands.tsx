import {Card, CardBody, CardTitle, ListGroup} from "react-bootstrap";
import React from "react";

export function Commands(props: { commands: JSX.Element[], title: String }) {
    return <Card className={'tools'}>
        <CardBody>
            <CardTitle>{props.title}</CardTitle>
            <ListGroup variant="flush">
                {props.commands.map((command) => <ListGroup.Item>{command}</ListGroup.Item>)}
            </ListGroup>
        </CardBody>
    </Card>;
}