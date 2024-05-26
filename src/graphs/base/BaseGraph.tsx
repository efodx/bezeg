import React, {Component} from 'react';
import '../../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {Point} from "./Point";
import {JGBox} from "../../JGBox";
import {Select} from "../../inputs/Select";
import {AbstractJSXPointControlledCurve} from "./AbstractJSXPointControlledCurve";
import {PointControlledCurve} from "../../bezeg/interfaces/point-controlled-curve";
import {Button, Card, CardBody, CardTitle, Col, Container, ListGroup, Row} from "react-bootstrap";

enum SelectedCurveOption {
    MOVE_CURVE,
    ADD_POINTS,
    DELETE_POINTS
}

interface BaseGraphProps {
    areCurvesSelectable?: boolean
    allowSelectedCurveControlPolygon?: boolean
}

interface BaseGraphStates {
    selectedCurveOption: SelectedCurveOption;
    showingControlPolygon: boolean;
    curveSelected: boolean;
}

function Tools({tools}: { tools: JSX.Element[] }) {
    return <Card>
        <CardBody>
            <CardTitle>Orodja</CardTitle>
            {tools}
        </CardBody>
    </Card>
}

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<U extends PointControlledCurve, T extends AbstractJSXPointControlledCurve<U>, P extends BaseGraphProps, S extends BaseGraphStates> extends Component<P, S> {
    static defaultProps = {
        areCurvesSelectable: true,
        allowSelectedCurveControlPolygon: true
    }
    public readonly state = this.getInitialState();
    protected board!: Board;
    protected jsxBezierCurves: T[] = [];
    protected graphJXGPoints: JXG.Point[] = [];

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

    getInitialState(): S {
        return {
            selectedCurveOption: SelectedCurveOption.MOVE_CURVE,
            curveSelected: false,
            showingControlPolygon: false
        } as S
    }

    getFirstCurve() {
        return this.getFirstJsxCurve()?.getCurve()
    }

    getFirstJsxCurve() {
        return this.jsxBezierCurves[0]
    }

    getAllJxgPoints() {
        return this.jsxBezierCurves.flatMap(c => c.getJxgPoints()).concat(this.graphJXGPoints)
    }

    componentDidMount() {
        if (this.board == null) {
            JXG.Options.text.display = 'internal';
            this.board = JSXGraph.initBoard("jgbox", {
                showFullscreen: true,
                boundingbox: [-5, 5, 5, -5],
                axis: true,
                keepaspectratio: true
            });
            this.board.on('down', (e) => this.handleDown(e));
            this.board.on('up', (e) => this.handleUp(e));
            this.board.on('move', (e) => this.handleMove(e));
            // this.board.stopResizeObserver()
            this.initialize()
        }
    }

    abstract initialize(): void;

    abstract newJSXBezierCurve(points: number[][]): T;

    createJSXBezierCurve(points: number[][]): T {
        let newBezierCurve = this.newJSXBezierCurve(points)
        this.jsxBezierCurves.push(newBezierCurve)
        return newBezierCurve
    }


    createJSXGraphPoint(x: () => number, y: () => number, opts?: any): Point;
    createJSXGraphPoint(x: () => number, y: () => number): Point;
    createJSXGraphPoint(x: number, y: number): Point;
    /**
     * Creates a JSXGraph point ands wraps it with the Point interface.
     * @param x
     * @param y
     * @param opts
     */
    createJSXGraphPoint(x: number | (() => number), y: number | (() => number), opts?: any): Point {
        let point;
        if (opts) {
            point = this.board.create('point', [x, y], opts);
        } else {
            point = this.board.create('point', [x, y]);
        }
        this.graphJXGPoints.push(point)
        return new Point(point);
    }

    // TODO change e to pointerevent
    getMouseCoords(e: any) {
        const pos = this.board.getMousePosition(e);
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);
    }

    getSelect() {
        return <Select onChange={e => this.onSelectChange(e)}
                       options={[
                           {
                               "value": "0",
                               "text": "Operiraj s krivuljo"
                           },
                           {
                               "value": "1",
                               "text": "Dodajaj točke"
                           },
                           {
                               "value": "2",
                               "text": "Briši točke"
                           }
                       ]}/>
    }

    render() {
        return <Container fluid>
            <Row className={"align-items-center"} style={{height: "92vh"}}>
                <Col xs={2}><Tools tools={this.getTools()}/></Col>
                <Col xs={8}><JGBox/></Col>
                <Col
                    xs={2}>{this.state.curveSelected ? this.getSelectableCurveArea() : this.getGraphCommandsArea()}</Col>
            </Row>
        </Container>;
    }

    getSelectedCurveCommands(): JSX.Element[] {
        if (this.props.allowSelectedCurveControlPolygon) {
            return [<div>{!this.state.showingControlPolygon ?
                <Button variant={"dark"} onClick={() => this.showControlPolygon()}>Prikaži kontrolni
                    poligon</Button> :
                <Button variant={"dark"} onClick={() => this.hideControlPolygon()}>Odstrani kontrolni poligon</Button>
            }
            </div>]
        }
        return []
    }

    showControlPolygon() {
        this.board.suspendUpdate()
        this.getSelectedCurve().showControlPolygon()
        this.setState({...this.state, showingControlPolygon: true})
        this.board.unsuspendUpdate()
    }

    hideControlPolygon() {
        this.board.suspendUpdate()
        this.getSelectedCurve().hideControlPolygon()
        this.setState({...this.state, showingControlPolygon: false})
        this.board.unsuspendUpdate()
    }

    handleDown(e: PointerEvent) {
        this.board.suspendUpdate()
        let coords = this.getMouseCoords(e);
        let selectedCurve, selectableCurve;
        if (this.state.selectedCurveOption === SelectedCurveOption.MOVE_CURVE) {
            selectedCurve = this.getSelectedCurve()
            if (selectedCurve) {
                selectedCurve.coords = coords
                if (selectedCurve.isMouseInsidePaddedBoundingBox()) {
                    selectedCurve.processMouseDown(e)
                } else {
                    this.deselectSelectedCurve();
                }
            }
            selectedCurve = this.getSelectedCurve()
            if (!selectedCurve) {
                // @ts-ignore
                if (!this.getAllJxgPoints().some(p => p.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) && this.props.areCurvesSelectable) {
                    selectableCurve = this.jsxBezierCurves.filter(curve => curve.isSelectable(e))[0]
                    if (selectableCurve) {
                        this.selectCurve(selectableCurve);
                    }
                }
            }
            this.board.unsuspendUpdate()
            return
        }
        let canCreate = true, el;


        for (el of this.board.objectsList) {
            // @ts-ignore
            if (JXG.isPoint(el) && el.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }
        if (canCreate && this.state.selectedCurveOption === SelectedCurveOption.ADD_POINTS && this.getSelectedCurve()) {
            this.getSelectedCurve().addPoint(coords.usrCoords[1], coords.usrCoords[2])
        }
        if (!canCreate && this.state.selectedCurveOption === SelectedCurveOption.DELETE_POINTS && this.getSelectedCurve()) {
            this.getSelectedCurve().getJxgPoints().every(
                (point, i) => {
                    // @ts-ignore
                    if (point.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                        this.getFirstJsxCurve().removePoint(i)
                        return false
                    }
                    return true
                }
            )
        }

        this.board.unsuspendUpdate()
    };

    getSelectedCurve() {
        return this.jsxBezierCurves.filter(curve => curve.isSelected())[0];
    }

    getGraphCommands(): JSX.Element[] {
        return []
    }

    getTools(): JSX.Element[] {
        return [<Button variant={"dark"} onClick={() => this.saveAsSVG()}>Izvozi kot SVG</Button>]
    }

    deselectSelectedCurve() {
        this.getSelectedCurve().deselect()
        this.setState({...this.state, curveSelected: false, showingControlPolygon: false})
    }

    protected selectCurve(selectableCurve: T) {
        selectableCurve.select()
        this.setState({...this.state, curveSelected: true})
    }

    private getSelectableCurveArea() {
        return <Card>
            <CardBody>
                <CardTitle>Izbrana krivulja</CardTitle>
                {this.getSelect()}

                <ListGroup variant="flush">
                    {(this.state.selectedCurveOption === SelectedCurveOption.MOVE_CURVE) ? this.getSelectedCurveCommands().map(command =>
                        <ListGroup.Item>{command}</ListGroup.Item>) : null}
                </ListGroup>
            </CardBody>
        </Card>
    }

    private handleUp(e: PointerEvent) {
        if (this.state.selectedCurveOption !== SelectedCurveOption.MOVE_CURVE) {
            // only handle when we're just moving curve
            return
        }
        this.board.suspendUpdate()
        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseUp(e)
        this.board.unsuspendUpdate()
    }

    private handleMove(e: PointerEvent) {
        if (this.state.selectedCurveOption !== SelectedCurveOption.MOVE_CURVE) {
            return
        }
        this.board.suspendUpdate()
        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseMove(e)
        this.board.unsuspendUpdate()
    }

    private onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let selectTool = e.target.value
        let selectedCurveOption = Number(selectTool)
        this.setState({...this.state, selectedCurveOption: selectedCurveOption})
    }

    private resizeBox(width: number, height: number) {
        this.board.resizeContainer(width, height);
        this.board.setBoundingBox(this.board.getBoundingBox(), true)
    }

    private getGraphCommandsArea() {
        return this.getGraphCommands().length > 0 ? <Card>
            <CardBody>
                <CardTitle>Ukazi na grafu</CardTitle>
                {this.getGraphCommands()}
            </CardBody>
        </Card> : null
    }
}

export default BaseGraph;
export type {BaseGraphProps, BaseGraphStates};

