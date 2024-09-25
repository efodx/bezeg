import {Preset, Presets, PresetService} from "./presets/Presets";
import React, {useContext, useRef, useState} from "react";
import {SiteContext} from "../context/react/SiteContext";
import {Button, ButtonGroup, Form, Modal} from "react-bootstrap";
import {wait} from "@testing-library/user-event/dist/utils";
import {RefreshContext} from "../context/react/RefreshContext";
import {ResetButton} from "./ResetButton";
import ToolTippedButton from "../../inputs/ToolTippedButton";
import {ImageStore} from "./ImageStore";


function exportToFile(data: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', "presets.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function GenerateImagesModal(props: { onConfirm: (fileContents: string) => void }) {
    const [show, setShow] = useState(false);
    const [fileContents, setFileContents] = useState("");

    const inputRef = useRef();
    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.onConfirm(fileContents);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <ToolTippedButton tooltip={"Uvozi prednastavitve"} onClick={handleShow}>
                📥
            </ToolTippedButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uvozi iz datoteke</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleConfirm();
                    }}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Izberi file</Form.Label>
                            <Form.Control
                                // @ts-ignore
                                ref={inputRef}
                                onChange={event => {
                                    // @ts-ignore
                                    inputRef.current.files[0].text().then(t => setFileContents(t));
                                }
                                } type="file"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zapri
                    </Button>
                    <Button onClick={handleConfirm}>
                        Uvozi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

function ImageGenerationModal(props: { onConfirm: (fileContents: string[]) => void, presetService: PresetService }) {
    const [show, setShow] = useState(false);
    const allPresets = props.presetService.loadPresets();
    let selectedPresets: string[] = allPresets.data.map(presets => presets.id);

    const inputRef = useRef();
    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.onConfirm(selectedPresets);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <ToolTippedButton tooltip={"Generiraj slike za prednastavitve"} onClick={handleShow}>🖼</ToolTippedButton>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Generiraj slike</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleConfirm();
                    }}>
                        {allPresets.data.map(preset => <Form.Check
                                type={'checkbox'}
                                id={`default-checkbox` + preset.id}
                                label={preset.id}
                                defaultChecked={selectedPresets.includes(preset.id)}
                                onChange={event => {
                                    if (event.target.checked) {
                                        selectedPresets.push(preset.id);
                                    } else {
                                        selectedPresets = selectedPresets.filter(presetId => preset.id !== presetId);
                                    }
                                }}
                            />
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zapri
                    </Button>
                    <Button onClick={handleConfirm}>
                        Generiraj
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

function ImportFromFileModal(props: { onConfirm: (fileContents: string) => void }) {
    const [show, setShow] = useState(false);
    const [fileContents, setFileContents] = useState("");

    const inputRef = useRef();
    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.onConfirm(fileContents);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <ToolTippedButton tooltip={"Uvozi prednastavitve"} onClick={handleShow}>
                📥
            </ToolTippedButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uvozi iz datoteke</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleConfirm();
                    }}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Izberi file</Form.Label>
                            <Form.Control
                                // @ts-ignore
                                ref={inputRef}
                                onChange={event => {
                                    // @ts-ignore
                                    inputRef.current.files[0].text().then(t => setFileContents(t));
                                }
                                } type="file"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zapri
                    </Button>
                    <Button onClick={handleConfirm}>
                        Uvozi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

function SaveModal(props: { onSave: (name: string) => void, initialValue: string }) {
    const [show, setShow] = useState(false);
    const [presetName, setPresetName] = useState(props.initialValue);

    const handleClose = () => setShow(false);
    const handleSave = () => {
        props.onSave(presetName);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <ToolTippedButton onClick={handleShow} tooltip={"Shrani prednastavitev"}>
                💾
            </ToolTippedButton>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shrani prednastavitev</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleSave();
                    }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Ime prednastavitve</Form.Label>
                            <Form.Control
                                onChange={event => setPresetName(event.target.value)}
                                type="text"
                                placeholder="zelo-licna-prednastavitev"
                                defaultValue={presetName}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zapri
                    </Button>
                    <Button onClick={handleSave}>
                        Shrani
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

function TrashModal(props: { trash: () => void, disabled?: boolean }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.trash();
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <ToolTippedButton disabled={props.disabled} onClick={handleShow} tooltip={"Izbriši prednastavitev"}>
                🗑
            </ToolTippedButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Izbriši prednastavitev?</Modal.Title>
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

export function PresetSelector(props: {
    presetService: PresetService,
    presetProvider: () => Preset,
    exporter?: any
}) {
    const siteContext = useContext(SiteContext);
    const presetContext = siteContext.preset;
    const refreshContext = useContext(RefreshContext);

    const [presets, setPresets] = useState({
        presets: props.presetService.loadPresets(),
        selectedPreset: props.presetService.getPreset(presetContext.selected)
    });

    function exportPresets(allPresets: Presets, index?: number) {
        if (index === undefined) {
            index = 0;
        }
        if (index === allPresets.data.length + 1) {
            ImageStore.createZip();
            return;
        }
        const preset = allPresets.data[index];
        setTimeout(() => {
            if (preset) {
                presetContext.setSelected(preset.id);
            }
            if (index! > 0) {
                props.exporter(allPresets.data[index! - 1].id);
            }
            wait(10).then(() => exportPresets(allPresets, index! + 1));
        });
    }

    return <Form.Group>
        <Form.Label>Prednastavitve</Form.Label>
        <Form.Select key={Math.random()} onChange={(value) => {
            const preset = props.presetService.getPreset(value.target.value);
            console.debug("Preset:", preset);
            if (preset !== undefined) {
                setPresets({
                    presets: presets.presets,
                    selectedPreset: preset
                });
                presetContext.setSelected(preset.id);
            } else {
                setPresets({
                    presets: presets.presets,
                    selectedPreset: preset
                });
                presetContext.setSelected("");
            }
        }} aria-label="Default select example"
                     defaultValue={presetContext.selected}
        >
            <option value={""}>{"Privzeta"}</option>
            {presets.presets.data.map(preset =>
                <option value={preset.id}>{preset.id}</option>)}
        </Form.Select>
        <Form.Group className="my-1">
            <ButtonGroup vertical={true}>
                <ButtonGroup>
                    <ResetButton/>
                    <SaveModal onSave={(name) => {
                        if (name === null || name === "") {
                            name = "preset-" + Math.random();
                        }
                        const newPresets = props.presetService.savePreset({
                            ...props.presetProvider(),
                            id: name
                        });
                        setPresets({
                            presets: newPresets,
                            selectedPreset: newPresets.data[newPresets.data.length - 1]
                        });
                        presetContext.setSelected(name);
                    }} initialValue={presetContext.selected}></SaveModal>
                    <TrashModal disabled={presets.selectedPreset === undefined} trash={() => {
                        const newPresets = props.presetService.removePreset(presets.selectedPreset.id);
                        setPresets({
                            presets: newPresets,
                            selectedPreset: newPresets.data[0]
                        });
                        presetContext.setSelected(newPresets.data[0]?.id);
                    }}></TrashModal>
                </ButtonGroup>
                <ButtonGroup>
                    <ToolTippedButton tooltip={"Izvozi prednastavitve"} onClick={() => {
                        exportToFile(props.presetService.exportAllPresetsToString());
                    }}>📤</ToolTippedButton>
                    <ImportFromFileModal onConfirm={fileContents => {
                        props.presetService.importFromString(fileContents);
                        refreshContext();
                    }}/>
                    <ImageGenerationModal onConfirm={presets => {
                        const allPresets = props.presetService.loadPresets();
                        exportPresets({data: allPresets.data.filter(preset => presets.includes(preset.id))});
                    }} presetService={props.presetService}/>

                </ButtonGroup></ButtonGroup></Form.Group>

    </Form.Group>;

}