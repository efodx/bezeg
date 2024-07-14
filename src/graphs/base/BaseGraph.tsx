import React, {Component, useContext, useState} from 'react';
import '../../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {JGBox} from "../../JGBox";
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
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

function SaveModal(props: { onSave: (name: string) => void }) {
    const [show, setShow] = useState(false);
    const [presetName, setPresetName] = useState("");

    const handleClose = () => setShow(false);
    const handleSave = () => {
        props.onSave(presetName)
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                💾
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shrani Preset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault()
                        handleSave()
                    }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Ime Preseta</Form.Label>
                            <Form.Control
                                onChange={event => setPresetName(event.target.value)}
                                type="text"
                                placeholder="zelo-licna-predstavitev"
                                defaultValue={presetName}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

function TrashModal(props: { trash: (name: string) => void }) {
    const [show, setShow] = useState(false);
    const [presetName, setPresetName] = useState("");

    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.trash(presetName)
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                🗑
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Izbriši Preset?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="secondary" onClick={handleConfirm}>
                        Da
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Ne
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );

}

function PresetSelector(props: {
    presetService: PresetService,
    dataProvider: () => string
}) {
    const selectedPresetContext = useContext(PresetContext)

    const [presets, setPresets] = useState({
        presets: props.presetService.loadPresets(),
        selectedPreset: props.presetService.getPreset(selectedPresetContext.selected)
    })
    return <div>
        Presets
        <Form.Select key={Math.random()} onChange={(value) => {
            const preset = props.presetService.getPreset(value.target.value)
            if (preset !== undefined) {
                setPresets({
                    presets: presets.presets,
                    selectedPreset: preset
                })
                selectedPresetContext.setSelected(preset.id)
            } else {
                setPresets({
                    presets: presets.presets,
                    selectedPreset: preset
                })
                selectedPresetContext.setSelected("")
            }
        }} aria-label="Default select example"
                     defaultValue={selectedPresetContext.selected}
        >
            <option value={""}>{"Privzet"}</option>
            {presets.presets.data.map(preset =>
                <option value={preset.id}>{preset.id}</option>)}
        </Form.Select>
        <SaveModal onSave={(name) => {
            if (name === null || name === "") {
                name = "preset-" + Math.random()
            }
            const newPresets = props.presetService.savePreset({
                data: props.dataProvider(),
                id: name
            })
            setPresets({
                presets: newPresets,
                selectedPreset: newPresets.data[newPresets.data.length - 1]
            })
            selectedPresetContext.setSelected(name)
        }}></SaveModal>

        <TrashModal trash={name => {
            if (name !== undefined || name !== "") {
                const newPresets = props.presetService.removePreset(presets.selectedPreset.id)
                setPresets({
                    presets: newPresets,
                    selectedPreset: newPresets.data[0]
                })
                selectedPresetContext.setSelected(newPresets.data[0]?.id)
            }
        }}></TrashModal>
    </div>
}

function SaveAsPng(props: { onClick: (fileName: string) => void }) {
    const presetContext = useContext(PresetContext)
    const fileName = presetContext.selected === "" ? "izvoz" : presetContext.selected
    return <Button variant={"dark"} onClick={() => props.onClick(fileName + ".png")}>Izvozi kot PNG</Button>;
}

function SaveAsSvg(props: { onClick: (fileName: string) => void }) {
    const presetContext = useContext(PresetContext)
    const fileName = presetContext.selected === "" ? "izvoz" : presetContext.selected
    return <Button variant={"dark"} onClick={() => props.onClick(fileName + ".svg")}>Izvozi kot SVG</Button>;
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

    saveAsSVG(fileName: string) {
        // @ts-ignore
        var svg = new XMLSerializer().serializeToString(this.board.renderer.svgRoot);
        const file = new File([svg], fileName, {type: "image/svg+xml"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = fileName;
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
            <SaveAsSvg onClick={(name) => this.saveAsSVG(name)}/>,
            <SaveAsPng onClick={(name) => this.saveAsPNG(name)}/>,
            <ResetButton/>,
            <ShowAxis board={() => this.board}></ShowAxis>,
            <SizeRange board={() => this.board}/>
        ]
        if (this.presetService) {
            tools.push(<PresetSelector presetService={this.presetService} dataProvider={() => this.exportPreset()}/>)
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


    private saveAsPNG(fileName: string) {
        const mmls = document.querySelectorAll<HTMLElement>("mjx-assistive-mml");
        mmls.forEach(el =>
            el.style.setProperty("display", "none", "important"));
        html2canvas(document.getElementById('jgbox') as HTMLElement).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        mmls.forEach(el =>
            el.style.removeProperty("display"));
    }
}

export default BaseGraph;

