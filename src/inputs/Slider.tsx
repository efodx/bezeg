import {useState} from "react";
import Form from 'react-bootstrap/Form';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    initialValue?: number;
    onChange: ((arg: number) => any);
    customText?: string;
    fixedValue?: number
}

export default function Slider(props: SliderProps) {
    const [value, setValue] = useState(props.initialValue);
    const {step = (props.max - props.min) / 100} = props;
    const renderValue = props.fixedValue !== undefined ? props.fixedValue : value!;
    return <Form>
        {props.customText ? <Form.Label>{props.customText}</Form.Label> :
            <Form.Text>{renderValue.toFixed(2)}</Form.Text>}
        <Form.Range min={props.min}
                    max={props.max} value={renderValue}
                    step={step}
                    onChange={e => {
                        if (props.fixedValue === undefined) {
                            setValue(Number(e.target.value));
                        }
                        props.onChange(Number(e.target.value));
                    }}></Form.Range>
    </Form>;
}