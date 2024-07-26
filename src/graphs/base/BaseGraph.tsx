import React, {Component} from 'react';
import '../../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {JGBox} from "../../JGBox";
import {Col, Container, Row} from "react-bootstrap";
import {SizeContext} from "../context/SizeContext";
import {Commands} from "./Commands";
import {Tools} from "./Tools";
import {ResetButton} from "./ResetButton";
import {ShowAxis} from "./ShowAxis";
import {AxisStyles} from "../styles/AxisStyles";
import Slider from "../../inputs/Slider";
import html2canvas from "html2canvas";
import {CacheContext} from "../context/CacheContext";
import {Preset, PresetService} from "./presets/Presets";
import {PresetContext} from "../context/react/PresetContext";
import {PresetSelector} from "./PresetSelector";
import {SaveImage} from "./SaveImage";

function SizeRange(props: { board: () => JXG.Board }) {
    return <div><Slider customText={"Povečava"} min={0} max={10} initialValue={SizeContext.getSize()} step={1}
                        onChange={(i) => {
                            SizeContext.setSize(i)
                            CacheContext.context += 1
                            props.board().fullUpdate()
                        }}/></div>;
}

export interface BaseGraphState {
    initialized: boolean
}

export interface BoardState {
    boundingBox: [number, number, number, number]
}

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<P, S extends BaseGraphState> extends Component<P, S> {
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
                console.log("updating context")
                CacheContext.context = CacheContext.context + 1
            });


            let presetContext = this.context
            this.setState({initialized: true})
            // @ts-ignore
            const preset = this.presetService?.getPreset(presetContext.selected)
            if (preset) {
                console.debug("PRESET:")
                console.debug(preset)
                this.importPreset(preset)
            } else {
                console.debug("PRESET:")
                console.debug(this.defaultPreset())
                this.importPresetData(this.defaultPreset())
            }

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
                <Col xs={1} sm={2}><Tools tools={this.getTools()}/></Col>
                <Col xs={10} sm={8}><JGBox/></Col>
                <Col xs={1} sm={2}>{this.getGraphCommandsArea()}</Col>
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
            <SaveImage saveAsSVG={name => this.saveAsSVG(name)} saveAsPNG={name => this.saveAsPNG(name)}/>,
            <ResetButton/>,
            <ShowAxis board={() => this.board}></ShowAxis>,
            <SizeRange board={() => this.board}/>
        ]
        if (this.presetService) {
            tools.push(<PresetSelector presetService={this.presetService}
                                       exporter={(fileName: string) => this.saveAsPNG(fileName)}
                                       presetProvider={() => this.exportPreset()}/>)
        }
        return tools
    }

    boardUpdate() {
        this.board.update()
    }

    getGraphCommandsArea() {
        return this.getGraphCommands().length > 0 ?
            <Commands commands={this.getGraphCommands()} title={"Ukazi na grafu"}/> : null
    }

    presets(): undefined | string {
        return undefined
    }

    exportPreset(): Preset {
        return {
            id: this.presets()!,
            boardState: this.boardState(),
            graphState: this.state,
            data: this.exportPresetData()
        };
    }

    importPreset(preset: Preset) {
        if (preset.boardState) {
            this.importBoardState(preset.boardState)
        }
        if (preset.graphState) {
            this.setState(preset.graphState)
        }
        if (preset.data) {
            this.importPresetData(preset.data)
        }
    }

    boardState(): BoardState {
        return {boundingBox: this.board.getBoundingBox()}
    }

    exportPresetData(): undefined | any {
        return undefined;
    }

    importPresetData(data: any) {
        // throw "NOT IMPLEMENTED"
    }

    abstract defaultPreset(): string

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

    private importBoardState(boardState: BoardState) {
        this.board.setBoundingBox(boardState.boundingBox, true)
        this.board.fullUpdate()
    }

}

export default BaseGraph;

