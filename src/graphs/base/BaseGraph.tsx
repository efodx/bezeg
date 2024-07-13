import React, {Component, useContext, useState} from 'react';
import '../../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {JGBox} from "../../JGBox";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {SizeContext} from "../context/SizeContext";
import {Commands} from "./Commands";
import {Tools} from "./Tools";
import {ResetButton} from "./ResetButton";
import {ShowAxis} from "./ShowAxis";
import {AxisStyles} from "../styles/AxisStyles";
import Slider from "../../inputs/Slider";
import html2canvas from "html2canvas";
import {CacheContext} from "../context/CacheContext";
import {PresetService} from "./presets/Presets";
import {PresetContext} from "../context/react/PresetContext";

function SizeRange(props: { board: () => JXG.Board }) {
    return <div><Slider customText={"Povečava"} min={0} max={10} initialValue={SizeContext.getSize()} step={1}
                        onChange={(i) => {
                            SizeContext.setSize(i)
                            CacheContext.context += 1
                            props.board().fullUpdate()
                        }}/></div>;
}


function PresetSelector(props: {
    presetService: PresetService,
    dataProvider: () => string,
    dataConsumer: (data: string) => void
}) {
    const [presets, setPresets] = useState({
        presets: props.presetService.loadPresets(),
        selectedPreset: props.presetService.loadPresets().data[0]
    })

    const selectedPresetContext = useContext(PresetContext)

    return <div>
        Presets
        <Form.Select key={Math.random()} onChange={(value) => {
            const preset = props.presetService.getPreset(value.target.value)
            setPresets({
                presets: presets.presets,
                selectedPreset: preset
            })
            selectedPresetContext.setSelected(preset.id)
            props.dataConsumer(preset.data)
        }} aria-label="Default select example"
                     defaultValue={selectedPresetContext.selected}
        >
            {presets.presets.data.map(preset =>
                <option value={preset.id}>{preset.id}</option>)}
        </Form.Select>
        <Button onClick={() => {
            let id = prompt('Ime preseta:')
            if (id === null) {
                id = "preset-" + Math.random()
            }

            const newPresets = props.presetService.savePreset({
                data: props.dataProvider(),
                id: id
            })
            setPresets({
                presets: newPresets,
                selectedPreset: newPresets.data[newPresets.data.length - 1]
            })
        }}>💾</Button>
        <Button onClick={() => {
            if (presets.selectedPreset) {
                const newPresets = props.presetService.removePreset(presets.selectedPreset.id)
                setPresets({
                    presets: newPresets,
                    selectedPreset: newPresets.data[0]
                })
            }
        }}>🗑</Button>
    </div>
}

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<P, S> extends Component<P, S> {
    static override contextType = PresetContext
    // TODO fix this, it doesn't work for some reason :/
    //  declare context: React.ContextType<typeof PresetContext>

    presetService: PresetService | undefined
    protected board!: Board;

    abstract initialize(): void;

    override componentDidMount() {
        if (this.board == null) {
            // JXG.Options.text.display = 'internal';
            this.board = JSXGraph.initBoard("jgbox", {
                showFullscreen: true,
                boundingBox: [-5, 5, 5, -5],
                axis: true,
                keepAspectRatio: true,
                showScreenshot: true,
                showCopyright: false,
                defaultAxes: {
                    x: AxisStyles.default,
                    y: AxisStyles.default
                }
                // @ts-ignore
                // theme: 'mono_thin'
            });
            this.board.on('update', (e) => {
                CacheContext.context = CacheContext.context + 1
            });

            this.initialize()
        }
    }

    saveAsSVG() {
        // @ts-ignore
        var svg = new XMLSerializer().serializeToString(this.board.renderer.svgRoot);
        const file = new File([svg], "slika.svg", {type: "image/svg+xml"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'izvoz.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    override render() {
        const presetsId = this.presets()
        if (presetsId) {
            this.presetService = new PresetService(presetsId)
        }
        return <Container fluid>
            <Row className={"align-items-center"} style={{height: "92vh"}}>
                <Col xs={2}><Tools tools={this.getTools()}/></Col>
                <Col xs={8}><JGBox/></Col>
                <Col xs={2}>{this.getGraphCommandsArea()}</Col>
            </Row>
        </Container>;
    }

    unsuspendBoardUpdate() {
        this.board.unsuspendUpdate()
        this.boardUpdate()
    }

    getGraphCommands(): JSX.Element[] {
        return []
    }

    getTools(): JSX.Element[] {
        const tools = [
            <Button variant={"dark"} onClick={() => this.saveAsSVG()}>Izvozi kot SVG</Button>,
            <Button variant={"dark"} onClick={() => this.saveAsPNG()}>Izvozi kot PNG</Button>,
            <ResetButton/>,
            <ShowAxis board={() => this.board}></ShowAxis>,
            <SizeRange board={() => this.board}/>
        ]
        if (this.presetService) {
            tools.push(<PresetSelector presetService={this.presetService} dataProvider={() => this.exportPreset()}
                                       dataConsumer={(data) => console.log(data)}/>)
        }
        return tools
    }

    boardUpdate() {
        CacheContext.context += 1
        this.board.update()
    }

    getGraphCommandsArea() {
        return this.getGraphCommands().length > 0 ?
            <Commands commands={this.getGraphCommands()} title={"Ukazi na grafu"}/> : null
    }

    presets(): undefined | string {
        return undefined
    }

    exportPreset() {
        return "";
    }

    importPreset(preset: string) {

    }

    private saveAsPNG() {
        const mmls = document.querySelectorAll<HTMLElement>("mjx-assistive-mml");
        mmls.forEach(el =>
            el.style.setProperty("display", "none", "important"));
        html2canvas(document.getElementById('jgbox') as HTMLElement).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'izvoz.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        mmls.forEach(el =>
            el.style.removeProperty("display"));
    }
}

export default BaseGraph;

