import React from 'react';
import '../../App.css';

import {Board} from "jsxgraph";
import {Point} from "./Point";
import {Select} from "../../inputs/Select";
import {AbstractJSXPointControlledCurve} from "./AbstractJSXPointControlledCurve";
import {PointControlledCurve} from "../../bezeg/interfaces/point-controlled-curve";
import {Form} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {Commands} from "./Commands";
import BaseGraph from "./BaseGraph";
import {VisibilityContext} from "../context/VisibilityContext";

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


/**
 * Abstract class for creating graphs.
 */
abstract class BaseCurveGraph<U extends PointControlledCurve, T extends AbstractJSXPointControlledCurve<U>, P extends BaseGraphProps, S extends BaseGraphStates> extends BaseGraph<P, S> {
    static defaultProps = {
        areCurvesSelectable: true,
        allowSelectedCurveControlPolygon: true
    }
    public override readonly state = this.getInitialState();
    protected inputsDisabled: boolean = false;
    protected jsxBezierCurves: T[] = [];
    protected graphJXGPoints: JXG.Point[] = [];

    getInitialState(): S {
        return {
            selectedCurveOption: SelectedCurveOption.MOVE_CURVE,
            curveSelected: false,
            showingControlPolygon: false
        } as S
    }

    getFirstCurve(): U {
        return this.getFirstJsxCurve()?.getCurve()
    }

    getFirstJsxCurve() {
        return this.jsxBezierCurves[0]
    }

    getAllJxgPoints() {
        return this.jsxBezierCurves.flatMap(c => c.getJxgPoints()).concat(this.graphJXGPoints)
    }

    override componentDidMount() {
        super.componentDidMount()
        this.board.on('down', (e) => this.handleDown(e));
        this.board.on('up', (e) => this.handleUp(e));
        this.board.on('move', (e) => this.handleMove(e));
    }

    abstract newJSXBezierCurve(points: number[][]): T;

    createJSXBezierCurve(points: number[][]): T {
        let newBezierCurve = this.newJSXBezierCurve(points)
        this.jsxBezierCurves.push(newBezierCurve)
        return newBezierCurve
    }

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

    override getGraphCommandsArea(): React.JSX.Element | null {
        return this.state.curveSelected ? this.getSelectableCurveArea() : super.getGraphCommandsArea();
    }

    getSelectedCurveCommands(): JSX.Element[] {
        if (this.props.allowSelectedCurveControlPolygon) {
            return [<Form> <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Kontrolni poligon"
                checked={this.getSelectedCurve().isShowingControlPolygon()}
                onChange={(e) => this.showControlPolygon(e.target.checked)}/>
            </Form>]
        }
        return []
    }

    showControlPolygon(show: boolean) {
        this.board.suspendUpdate()
        if (show) {
            this.getSelectedCurve().showControlPolygon()
        } else {
            this.getSelectedCurve().hideControlPolygon()
        }
        this.setState({...this.state, showingControlPolygon: show})
        this.unsuspendBoardUpdate()
    }

    handleDown(e: PointerEvent) {
        if (this.inputsDisabled) {
            return
        }
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
            this.unsuspendBoardUpdate()
            return
        }
        let canCreate = true;

        for (let el of this.board.objectsList) {
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

        this.unsuspendBoardUpdate()
    };

    getSelectedCurve() {
        return this.jsxBezierCurves.filter(curve => curve.isSelected())[0];
    }


    override getTools(): JSX.Element[] {
        return super.getTools().concat(<OnOffSwitch label="Oznake točk"
                                                    initialState={VisibilityContext.pointsVisible()}
                                                    onChange={checked => this.showPointLabels(checked)}/>)
    }

    deselectSelectedCurve() {
        this.getSelectedCurve().deselect()

        this.setState({...this.state, curveSelected: false, showingControlPolygon: false})
    }

    getAllJxgCurves() {
        return this.jsxBezierCurves.map(curve => curve.getJxgCurve());
    }

    getSelectableCurveArea() {
        let commands = [this.getSelect()]
        if (this.state.selectedCurveOption === SelectedCurveOption.MOVE_CURVE) {
            commands = commands.concat(this.getSelectedCurveCommands())
        }
        return <Commands commands={commands} title={"Izbrana krivulja"}></Commands>
    }

    protected selectCurve(selectableCurve: T, additionalState = {}) {
        selectableCurve.select()
        this.setState({...this.state, curveSelected: true, ...additionalState})
    }

    private handleUp(e: PointerEvent) {
        if (this.state.selectedCurveOption !== SelectedCurveOption.MOVE_CURVE) {
            // only handle when we're just moving curve
            return
        }
        this.board.suspendUpdate()
        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseUp(e)
        this.unsuspendBoardUpdate()
    }

    private handleMove(e: PointerEvent) {
        if (this.state.selectedCurveOption !== SelectedCurveOption.MOVE_CURVE) {
            return
        }
        this.board.suspendUpdate()
        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseMove(e)
        this.unsuspendBoardUpdate()
    }

    private onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let selectTool = e.target.value
        let selectedCurveOption = Number(selectTool)
        this.setState({...this.state, selectedCurveOption: selectedCurveOption})
    }

    private showPointLabels(show: boolean) {
        this.board.suspendUpdate()
        VisibilityContext.setPointVisibility(show)
        this.unsuspendBoardUpdate()
    }
}

export default BaseCurveGraph;
export type {BaseGraphProps, BaseGraphStates};

