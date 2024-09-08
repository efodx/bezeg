import React, {Component, useRef, useState} from 'react';


import {Board, JSXGraph} from "jsxgraph";
import {JGBox} from "../../JGBox";
import {Col, Container, Overlay, Popover, Row} from "react-bootstrap";
import {SizeContext} from "../context/SizeContext";
import {Commands} from "./Commands";
import {Tools} from "./Tools";
import {AxisStyles} from "../styles/AxisStyles";
import Slider from "../../inputs/Slider";
import html2canvas from "html2canvas";
import {CacheContext} from "../context/CacheContext";
import {Preset, PresetService} from "./presets/Presets";
import {SiteContext} from "../context/react/SiteContext";
import {PresetSelector} from "./PresetSelector";
import {SaveImage} from "./SaveImage";
import {AxisSelector} from "./AxisSelector";
import {AxisContext} from "../context/AxisContext";
import ToolTippedButton from "../../inputs/ToolTippedButton";
import {ImageStore} from "./ImageStore";


function Help() {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event: any) => {
        setShow(!show);
        setTarget(event.target);
    };


    return (
        <div className={'help-button'} ref={ref}>
            <ToolTippedButton tooltip={"Pomoč"} onClick={handleClick}>🛈</ToolTippedButton>
            <Overlay
                show={show}
                target={target}
                placement="top-start"
                container={ref}
                containerPadding={20}
            >
                <Popover id="popover-contained">
                    <Popover.Header as="h3">Premikanje po grafu</Popover.Header>
                    <Popover.Body>
                        <strong>Premik</strong>:
                        <div><strong>Shift</strong> + <strong>Levi klik miške</strong></div>
                    </Popover.Body>
                    <Popover.Body>
                        <strong>Povečava</strong>:
                        <div>
                            <strong>Shift</strong> + <strong>Miškin kolešček</strong>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

function SizeRange(props: { board: () => JXG.Board }) {
    return <div><Slider customText={"Povečava"} min={0} max={25} initialValue={SizeContext.getSize()} step={1}
                        onChange={(i) => {
                            SizeContext.setSize(i);
                            CacheContext.update();
                            props.board().fullUpdate();
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
    static override contextType = SiteContext;
    // TODO fix this, it doesn't work for some reason :/
    //  declare context: React.ContextType<typeof PresetContext>

    presetService: PresetService | undefined;
    protected board!: Board;

    abstract initialize(): void;

    override componentDidMount() {
        if (this.board == null) {
            // JXG.Options.text.display = 'internal';
            this.board = JSXGraph.initBoard("jgbox", {
                showFullscreen: false,
                boundingBox: [-5, 5, 5, -5],
                // @ts-ignore
                axis: AxisContext.axisVisible,
                keepAspectRatio: true,
                showScreenshot: false,
                showCopyright: false,
                showNavigation: false,
                defaultAxes: {
                    x: AxisStyles.defaultX,
                    y: AxisStyles.defaultY
                },
                //theme: 'mono_thin'
            });

            // this is a way to brute force the updates, but it is not the most efficient
            // this.board.on('update', (e) => {
            //    CacheContext.update()
            // });


            let siteContext = this.context;
            this.setState({initialized: true});
            // @ts-ignore
            const preset = this.presetService?.getPreset(siteContext.preset.selected);
            if (preset) {
                console.debug("Loading preset:");
                console.debug(preset);
                this.importPreset(preset);
            } else {
                console.debug("Loading default preset:");
                console.debug(this.defaultPreset());
                this.importPresetData(this.defaultPreset());
            }

            this.initialize();
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
        const presetsId = this.presets();
        if (presetsId) {
            this.presetService = new PresetService(presetsId);
        }
        // @ts-ignore
        const fullScreenContext = this.context.fullScreen;
        return <Container fluid>
            <Row className={"align-items-center"} style={{height: "92vh"}}>
                <Col className={(fullScreenContext.fullScreen ? 'tools-fs' : '')}
                     xs={0} lg={2}><Tools
                    tools={this.getTools()}/></Col>
                <Col className={fullScreenContext.fullScreen ? 'graph-fs' : 'graph'} xs={12}
                     lg={fullScreenContext.fullScreen ? 12 : 8}><JGBox/>
                    <div className={"help-container"}><Help></Help>
                        <div className={"fs-button"}>
                            <ToolTippedButton tooltip={"Predstavitveni način"}
                                              onClick={() => fullScreenContext.setFullScreen(!fullScreenContext.fullScreen)}>⛶</ToolTippedButton>
                        </div>
                    </div>
                </Col>
                <Col className={fullScreenContext.fullScreen ? 'graph-commands-fs' : 'graph-commands'}
                     xs={0}
                     lg={2}>{this.getGraphCommandsArea()}</Col>
            </Row>
        </Container>;
    }

    unsuspendBoardUpdate() {
        this.boardUpdate();
        this.board.unsuspendUpdate();
    }

    getGraphCommands(): JSX.Element[] {
        return [];
    }

    getTools(): JSX.Element[] {
        const tools = [<AxisSelector board={() => this.board}></AxisSelector>,
            <SizeRange board={() => this.board}/>,
            <SaveImage saveAsSVG={name => this.saveAsSVG(name)} saveAsPNG={name => this.saveAsPNG(name)}/>,
        ];
        if (this.presetService) {
            tools.push(<PresetSelector presetService={this.presetService}
                                       exporter={(fileName: string) => this.saveAsPNG(fileName)}
                                       presetProvider={() => this.exportPreset()}/>);
        }
        return tools;
    }

    boardUpdate() {
        CacheContext.update();
        this.board.update();
    }

    getGraphCommandsArea() {
        return this.getGraphCommands().length > 0 ?
            <Commands commands={this.getGraphCommands()} title={"Ukazi na grafu"}/> : null;
    }

    presets(): undefined | string {
        return undefined;
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
            this.importBoardState(preset.boardState);
        }
        if (preset.graphState) {
            this.setState(preset.graphState);
        }
        if (preset.data) {
            this.importPresetData(preset.data);
        }
    }

    boardState(): BoardState {
        return {boundingBox: this.board.getBoundingBox()};
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
        ImageStore.creatingImage();
        html2canvas(document.getElementById('jgbox') as HTMLElement).then(canvas => {
            canvas.toBlob(blob => {
                if (blob == null) {
                    return;
                }
                ImageStore.addImage(blob, fileName);
            });
            //
            // link.download = fileName;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
        });
        mmls.forEach(el =>
            el.style.removeProperty("display"));
    }

    private importBoardState(boardState: BoardState) {
        this.board.setBoundingBox(boardState.boundingBox, true);
        this.board.fullUpdate();
    }

}

export default BaseGraph;

