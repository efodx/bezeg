import {Board} from "jsxgraph";
import React, {useState} from "react";
import {Form} from "react-bootstrap";

export function ShowAxis(props: { board: () => Board }) {
    const [checked, setChecked] = useState(true)
    return <Form> <Form.Check
        type="switch"
        id="custom-switch2"
        label="Mreža"
        checked={checked}
        onChange={(e) => {
            props.board().objectsList.forEach(el => {
                // @ts-ignore
                if (el.elType === "axis" || el.elType === "ticks") {
                    if (e.target.checked) {
                        // @ts-ignore
                        el.show()
                    } else {
                        // @ts-ignore
                        el.hide()
                    }
                }
            })
            setChecked(e.target.checked)
        }}/>
    </Form>
}