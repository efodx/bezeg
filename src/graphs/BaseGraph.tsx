import React, {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import {Select} from "../inputs/Select";
import {AbstractJSXPointControlledCurve} from "./AbstractJSXPointControlledCurve";
import {PointControlledCurve} from "../bezeg/point-controlled-curve";

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<U extends PointControlledCurve, T extends AbstractJSXPointControlledCurve<U>> extends Component<any, any> {
    protected board: Board;
    protected jsxBezierCurves: T[] = [];
    protected graphJXGPoints: JXG.Point[] = [];
    protected areCurvesSelectable: boolean = false;

    protected constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true};
        this.board = null as unknown as Board;
    }

    getFirstCurve() {
        return this.jsxBezierCurves[0]?.getCurve()
    }

    getAllJxgPoints() {
        return this.jsxBezierCurves.flatMap(c => c.getJxgPoints()).concat(this.graphJXGPoints)
    }

    componentDidMount() {
        if (this.board == null) {
            this.board = JSXGraph.initBoard("jgbox", {
                showFullscreen: true, boundingbox: [-5, 5, 5, -5], axis: true
            });
            this.board.on('down', (e) => this.handleDown(e));
            this.board.on('up', (e) => this.handleUp(e));
            this.board.on('move', (e) => this.handleMove(e));
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
                               "value": "1",
                               "text": "Premikaj točke"
                           },
                           {
                               "value": "2",
                               "text": "Dodajaj točke"
                           },
                           {
                               "value": "3",
                               "text": "Briši točke"
                           }
                       ]}/>
    }

    render() {
        return <div><JGBox/>
            {this.areCurvesSelectable ? this.getSelect() : null}
            {this.getAdditionalCommands()}
        </div>;
    }

    handleDown(e: PointerEvent) {
        this.board.suspendUpdate()
        let coords = this.getMouseCoords(e);
        let selectedCurve, selectableCurve;
        if (this.state.justMoving) {
            selectedCurve = this.getSelectedCurve()
            if (selectedCurve) {
                selectedCurve.coords = coords
                if (selectedCurve.isMouseInsidePaddedBoundingBox()) {
                    selectedCurve.processMouseDown(e)
                } else {
                    selectedCurve.deselect()
                }
            }
            selectedCurve = this.getSelectedCurve()
            if (!selectedCurve) {
                // @ts-ignore
                if (!this.getAllJxgPoints().some(p => p.hasPoint(coords.scrCoords[1], coords.scrCoords[2]))) {
                    selectableCurve = this.jsxBezierCurves.filter(curve => curve.isSelectable(e))[0]
                    selectableCurve?.select()
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
        if (canCreate && !this.state.deletingPoints) {
            this.jsxBezierCurves[0].addPoint(coords.usrCoords[1], coords.usrCoords[2])
        }
        if (!canCreate && this.state.deletingPoints) {
            this.jsxBezierCurves[0].getJxgPoints().every(
                (point, i) => {
                    // @ts-ignore
                    if (point.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                        this.board.removeObject(point)
                        this.getFirstCurve().removePoint(this.getFirstCurve().getPoints()[i])
                        return false
                    }
                    return true
                }
            )
        }

        this.board.unsuspendUpdate()
    };

    protected abstract getAdditionalCommands(): JSX.Element;

    private deletePoints() {
        this.setState(
            {
                deletingPoints: true,
                justMoving: false
            }
        )
    }

    private addPoints() {
        this.setState(
            {
                deletingPoints: false,
                justMoving: false
            }
        )
    }

    private justMove() {
        this.setState(
            {
                deletingPoints: false,
                justMoving: true
            }
        )
    }

    private handleUp(e: PointerEvent) {
        this.board.suspendUpdate()
        if (!this.state.justMoving) {
            // only handle when we're just moving shit
            return
        }

        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseUp(e)
        this.board.unsuspendUpdate()
    }

    private getSelectedCurve() {
        return this.jsxBezierCurves.filter(curve => curve.isSelected())[0];
    }

    private handleMove(e: PointerEvent) {
        this.board.suspendUpdate()
        if (!this.state.justMoving) {
            return
        }

        let selectedCurve = this.getSelectedCurve()
        selectedCurve?.processMouseMove(e)
        this.board.unsuspendUpdate()
    }

    private onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let selectTool = e.target.value
        switch (selectTool) {
            case "1":
                this.justMove()
                return
            case "2":
                this.jsxBezierCurves[0].deselect()
                this.addPoints()
                return
            case "3":
                this.jsxBezierCurves[0].deselect()
                this.deletePoints()
                return
        }
    }
}

export default BaseGraph;
