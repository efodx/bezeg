import React, {Component} from 'react';
import '../../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {JGBox} from "../../JGBox";
import {Button, Col, Container, Row} from "react-bootstrap";
import {SizeContext} from "../context/SizeContext";
import {Commands} from "./Commands";
import {Tools} from "./Tools";
import {ResetButton} from "./ResetButton";
import {ShowAxis} from "./ShowAxis";
import {AxisStyles} from "../styles/AxisStyles";
import Slider from "../../inputs/Slider";
import html2canvas from "html2canvas";
import {CacheContext} from "../context/CacheContext";

function SizeRange(props: { board: () => JXG.Board }) {
    return <div><Slider customText={"Povečava"} min={0} max={10} initialValue={SizeContext.getSize()} step={1}
                        onChange={(i) => {
                            SizeContext.setSize(i)
                            CacheContext.context += 1
                            props.board().fullUpdate()
                        }}/></div>;
}

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<P, S> extends Component<P, S> {
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
        return [
            <Button variant={"dark"} onClick={() => this.saveAsSVG()}>Izvozi kot SVG</Button>,
            <ResetButton/>,
            <ShowAxis board={() => this.board}></ShowAxis>,
            <SizeRange board={() => this.board}/>
        ]
    }

    boardUpdate() {
        CacheContext.context += 1
        this.board.update()
    }

    getGraphCommandsArea() {
        return this.getGraphCommands().length > 0 ?
            <Commands commands={this.getGraphCommands()} title={"Ukazi na grafu"}/> : null
    }

    private saveAsPNG() {
        html2canvas(document.getElementById('jgbox') as HTMLElement).then(canvas => {
            document.body.appendChild(canvas)
        })
    }
}

export default BaseGraph;

