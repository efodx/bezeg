import {Presets, PresetService} from "./presets/Presets";
import React, {useContext, useState} from "react";
import {PresetContext} from "../context/react/PresetContext";
import {Button, Form, Modal} from "react-bootstrap";
import {wait} from "@testing-library/user-event/dist/utils";

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

function TrashModal(props: { trash: (name: string) => void, disabled?: boolean }) {
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
            <Button disabled={props.disabled} variant="primary" onClick={handleShow}>
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

export function PresetSelector(props: {
    presetService: PresetService,
    dataProvider: () => string,
    exporter?: any
}) {
    const selectedPresetContext = useContext(PresetContext)

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
        <TrashModal disabled={presets.selectedPreset === undefined} trash={name => {
            if (name !== undefined || name !== "") {
                const newPresets = props.presetService.removePreset(presets.selectedPreset.id)
                setPresets({
                    presets: newPresets,
                    selectedPreset: newPresets.data[0]
                })
                selectedPresetContext.setSelected(newPresets.data[0]?.id)
            }
        }}></TrashModal>
        <Button onClick={() => {
            const allPresets = props.presetService.loadPresets()
            exportPresets(allPresets);
        }}>EXPORTAJ VSE</Button>
    </div>

}