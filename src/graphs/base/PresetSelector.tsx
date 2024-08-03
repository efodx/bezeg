import {Preset, Presets, PresetService} from "./presets/Presets";
import React, {useContext, useRef, useState} from "react";
import {PresetContext} from "../context/react/PresetContext";
import {Button, Form, Modal} from "react-bootstrap";
import {wait} from "@testing-library/user-event/dist/utils";
import {RefreshContext} from "../context/react/RefreshContext";
import {ResetButton} from "./ResetButton";


function exportToFile(data: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', "presets.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function ImportFromFileModal(props: { onConfirm: (fileContents: string) => void }) {
    const [show, setShow] = useState(false);
    const [fileContents, setFileContents] = useState("");

    const inputRef = useRef()
    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        props.onConfirm(fileContents)
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="ms-1" variant="dark" onClick={handleShow}>
                Uvozi
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uvozi iz datoteke</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault()
                        handleConfirm()
                    }}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Izberi file</Form.Label>
                            <Form.Control
                                // @ts-ignore
                                ref={inputRef}
                                onChange={event => {
                                    // @ts-ignore
                                    inputRef.current.files[0].text().then(t => setFileContents(t))
                                }
                                } type="file"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zapri
                    </Button>
                    <Button variant="dark" onClick={handleConfirm}>
                        Uvozi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

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
            <Button variant="dark" onClick={handleShow}>
                💾
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shrani prednastavitev</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e => {
                        e.preventDefault()
                        handleSave()
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
                    <Button variant="dark" onClick={handleSave}>
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
        props.trash()
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="ms-1" variant="dark" disabled={props.disabled} onClick={handleShow}>
                🗑
            </Button>
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
    const selectedPresetContext = useContext(PresetContext)
    const refreshContext = useContext(RefreshContext)

    const [presets, setPresets] = useState({
        presets: props.presetService.loadPresets(),
        selectedPreset: props.presetService.getPreset(selectedPresetContext.selected)
    })

    function exportPresets(allPresets: Presets, index?: number) {
        if (index == undefined) {
            index = 0
        }
        if (index === allPresets.data.length + 1) {
            return
        }
        const preset = allPresets.data[index]
        setTimeout(() => {
            if (preset) {
                selectedPresetContext.setSelected(preset.id)
            }
            if (index! > 0) {
                props.exporter(allPresets.data[index! - 1].id)
            }
            wait(10).then(() => exportPresets(allPresets, index! + 1))
        })
    }

    return <Form.Group>
        <Form.Label>Prednastavitve</Form.Label>
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
            <option value={""}>{"Privzeta"}</option>
            {presets.presets.data.map(preset =>
                <option value={preset.id}>{preset.id}</option>)}
        </Form.Select>
        <Form.Group className="mx-auto my-1">
            <SaveModal onSave={(name) => {
                if (name === null || name === "") {
                    name = "preset-" + Math.random()
                }
                const newPresets = props.presetService.savePreset({
                    ...props.presetProvider(),
                    id: name
                })
                setPresets({
                    presets: newPresets,
                    selectedPreset: newPresets.data[newPresets.data.length - 1]
                })
                selectedPresetContext.setSelected(name)
            }}></SaveModal>
            <TrashModal disabled={presets.selectedPreset === undefined} trash={() => {
                const newPresets = props.presetService.removePreset(presets.selectedPreset.id)
                setPresets({
                    presets: newPresets,
                    selectedPreset: newPresets.data[0]
                })
                selectedPresetContext.setSelected(newPresets.data[0]?.id)
            }}></TrashModal>
        </Form.Group>
        <Form.Group className="mx-auto my-1">
            <Button variant="dark" onClick={() => {
                exportToFile(props.presetService.exportAllPresetsToString())
            }}>Ivozi</Button>
            <ImportFromFileModal onConfirm={fileContents => {
                props.presetService.importFromString(fileContents)
                refreshContext()
            }}/></Form.Group>
        <Button variant="dark" onClick={() => {
            const allPresets = props.presetService.loadPresets()
            exportPresets(allPresets);
        }}>Generiraj slike</Button>
        <Form.Group className="mx-auto my-1">
            <ResetButton/>
        </Form.Group>
    </Form.Group>

}