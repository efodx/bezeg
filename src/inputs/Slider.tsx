import {useState} from "react";
import Form from 'react-bootstrap/Form';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    initialValue: number;
    onChange: ((arg: number) => any)
}

export default function Slider(props: SliderProps) {
    const [value, setValue] = useState(props.initialValue)
    const {step = (props.max - props.min) / 100} = props
    return <Form>
        <Form.Text>{value.toFixed(2)}</Form.Text>
        <Form.Range min={props.min}
                    max={props.max} value={value}
                    step={step}
                    onChange={e => {
                        setValue(Number(e.target.value))
                        props.onChange(Number(e.target.value))
                    }}></Form.Range>
    </Form>
}