import React, {useContext} from "react";
import {SiteContext} from "../context/react/SiteContext";
import {Button, Form} from "react-bootstrap";

export function SaveImage(props: { saveAsSVG: (name: string) => void, saveAsPNG: (name: string) => void }) {
    return <div>
        <Form.Label>Izvoz slike</Form.Label>
        <div>
            <SaveAsSvg onClick={props.saveAsSVG}/>
            <SaveAsPng onClick={props.saveAsPNG}/>
        </div>
    </div>;
}

function SaveAsPng(props: { onClick: (fileName: string) => void }) {
    const siteContext = useContext(SiteContext);
    const fileName = siteContext.preset.selected === "" ? "izvoz" : siteContext.preset.selected;
    return <Button className="ms-1" onClick={() => props.onClick(fileName + ".png")}>PNG</Button>;
}

function SaveAsSvg(props: { onClick: (fileName: string) => void }) {
    const siteContext = useContext(SiteContext);
    const fileName = siteContext.preset.selected === "" ? "izvoz" : siteContext.preset.selected;
    return <Button onClick={() => props.onClick(fileName + ".svg")}>SVG</Button>;
}