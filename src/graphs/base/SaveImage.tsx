import React, {useContext} from "react";
import {PresetContext} from "../context/react/PresetContext";
import {Button, Form} from "react-bootstrap";

export function SaveImage(props: { saveAsSVG: (name: string) => void, saveAsPNG: (name: string) => void }) {
    return <div>
        <Form.Label>Izvozi</Form.Label>
        <div>
            <SaveAsSvg onClick={props.saveAsSVG}/>
            <SaveAsPng onClick={props.saveAsPNG}/>
        </div>
    </div>;
}

function SaveAsPng(props: { onClick: (fileName: string) => void }) {
    const presetContext = useContext(PresetContext)
    const fileName = presetContext.selected === "" ? "izvoz" : presetContext.selected
    return <Button className="ms-1" onClick={() => props.onClick(fileName + ".png")}>PNG</Button>;
}

function SaveAsSvg(props: { onClick: (fileName: string) => void }) {
    const presetContext = useContext(PresetContext)
    const fileName = presetContext.selected === "" ? "izvoz" : presetContext.selected
    return <Button onClick={() => props.onClick(fileName + ".svg")}>SVG</Button>;
}