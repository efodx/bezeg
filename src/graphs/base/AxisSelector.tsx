import React, {useState} from "react";
import {Form} from "react-bootstrap";
import {AxisContext, AxisSelect} from "../context/AxisContext";


export function AxisSelector(props: { board: () => JXG.Board }) {

    const [selectedAxis, setAxis] = useState(AxisContext.getSelected())

    return <Form.Group>
        <Form.Label>Mreža</Form.Label>
        <Form.Select key={Math.random()} onChange={(value) => {
            AxisContext.setSelected(value.target.value as AxisSelect)
            setAxis(value.target.value as AxisSelect)
            props.board().fullUpdate()
        }} aria-label="Default select example"
                     defaultValue={selectedAxis}
        >
            {Object.values(AxisSelect).map(select =>
                <option value={select}>{select}</option>)}
        </Form.Select>
    </Form.Group>

}