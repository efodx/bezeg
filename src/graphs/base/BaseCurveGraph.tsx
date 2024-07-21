import React from 'react';
import '../../App.css';

import {Board} from "jsxgraph";
import {Point} from "../object/Point";
import {Select} from "../../inputs/Select";
import {
    AbstractJSXPointControlledCurve,
    PointControlledCurveAttributes
} from "../object/AbstractJSXPointControlledCurve";
import {PointControlledCurve} from "../../bezeg/api/curve/point-controlled-curve";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {Commands} from "./Commands";
import BaseGraph, {BaseGraphState} from "./BaseGraph";
import {VisibilityContext} from "../context/VisibilityContext";
import {Continuity} from "../../bezeg/impl/curve/bezier-spline";
import {JSXSplineCurve} from "../object/JSXSplineCurve";
import {JSXBezierCurve} from "../object/JSXBezierCurve";
import {JSXRationalBezierCurve} from "../object/JSXRationalBezierCurve";
import {JSXPHBezierCurve} from "../object/JSXPHBezierCurve";
import {ClassMapper} from "../object/ClassMapper";
import {PointStyles} from "../styles/PointStyles";

enum SelectedCurveOption {
    MOVE_CURVE,
    ADD_POINTS,
    DELETE_POINTS
}

interface BaseGraphStates extends BaseGraphState {
    selectedCurveOption: SelectedCurveOption;
    curveSelected: boolean;
}

JXG.extend(JXG.Point.prototype, {})

/**
 * Abstract class for creating graphs.
 */
abstract class BaseCurveGraph<P, S extends BaseGraphStates> extends BaseGraph<P, S> {
    public override readonly state = this.getInitialState();
    protected inputsDisabled: boolean = false;
    protected jsxBezierCurves: AbstractJSXPointControlledCurve<PointControlledCurve, PointControlledCurveAttributes>[] = [];
    protected graphJXGPoints: JXG.Point[] = [];


    initialize() {
    }

    getInitialState(): S {
        return {
            selectedCurveOption: SelectedCurveOption.MOVE_CURVE,
            curveSelected: false
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

    override componentDidMount() {
        super.componentDidMount()
        this.board.on('down', (e) => this.handleDown(e));
        this.board.on('up', (e) => this.handleUp(e));
        this.board.on('move', (e) => this.handleMove(e));
    }

    createJSXBezierCurve(points: number[][]) {
        let newBezierCurve = new JSXBezierCurve(points, this.board)
        newBezierCurve.setSubdivisionResultConsumer((jsxCrv) => this.jsxBezierCurves.push(jsxCrv))
        this.jsxBezierCurves.push(newBezierCurve)
        return newBezierCurve
    }

    createJSXPHBezierCurve(points: number[][]) {
        let newBezierCurve = new JSXPHBezierCurve(points, this.board) as JSXBezierCurve;
        newBezierCurve.setSubdivisionResultConsumer((jsxCrv) => this.jsxBezierCurves.push(jsxCrv))
        this.jsxBezierCurves.push(newBezierCurve)
        return newBezierCurve
    }

    createJSXSplineCurve(points: number[][], degree: number, continuity: Continuity): JSXSplineCurve {
        let newBezierCurve = new JSXSplineCurve(points, continuity, degree, this.board);
        this.jsxBezierCurves.push(newBezierCurve)
        return newBezierCurve
    }

    createRationalJSXBezierCurve(points: number[][], weights: number[]): JSXRationalBezierCurve {
        const curve = new JSXRationalBezierCurve(points, weights, this.board);
        this.jsxBezierCurves.push(curve)
        curve.setSubdivisionResultConsumer((jsxCrv) => this.jsxBezierCurves.push(jsxCrv))
        return curve
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
            point = this.board.create('point', [x, y], PointStyles.default);
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
        if (this.getSelectedCurve()) {
            return this.getSelectedCurve().getCurveCommands()
        }
        return []
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
                if (!this.getAllJxgPoints().some(p => p.hasPoint(coords.scrCoords[1], coords.scrCoords[2]))) {
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

    override exportPresetData() {
        return this.jsxBezierCurves.map(curve => {
            // @ts-ignore
            return [ClassMapper.getClassName(curve.constructor), ClassMapper.getToStr(curve.constructor)(curve)]
        })
    }

    override importPresetData(str: string) {
        // @ts-ignore
        this.board.removeObject(this.getAllJxgCurves().concat(this.getAllJxgPoints()))
        this.jsxBezierCurves = []
        this.graphJXGPoints = []

        // @ts-ignore
        str.forEach(p => {
            const [id, object] = [p[0], p[1]]
            return this.jsxBezierCurves.push(ClassMapper.getFromStr(id)(object, this.board))
        })

    }

    protected selectCurve(selectableCurve: AbstractJSXPointControlledCurve<PointControlledCurve, PointControlledCurveAttributes>, additionalState = {}) {
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
export type {BaseGraphStates};

