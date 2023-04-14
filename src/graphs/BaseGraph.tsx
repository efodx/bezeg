import React, {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import {Select} from "../inputs/Select";
import {BezierCurve} from "../bezeg/bezier-curve";
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";

/**
 * Abstract class for creating graphs.
 */
abstract class BaseGraph<U extends BezierCurve, T extends AbstractJSXBezierCurve<U>> extends Component<any, any> {
    protected board: Board;
    protected jsxBezierCurves: T[] = [];
    protected graphJXGPoints: JXG.Point[] = [];
    protected areCurvesSelectable: boolean = false;

    protected constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true};
        this.board = null as unknown as Board;
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
        console.log("created point")
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
        if (this.state.justMoving) {
            this.jsxBezierCurves[0].processMouseDown(e)
            return
        }
        let canCreate = true,
            coords: JXG.Coords, el;

        coords = this.getMouseCoords(e);

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
                        this.jsxBezierCurves[0].getBezierCurve().removePoint(this.jsxBezierCurves[0].getBezierCurve().getPoints()[i])
                        return false
                    }
                    return true
                }
            )
        }

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
        if (!this.state.justMoving) {
            // only handle when we're just moving shit
            return
        }
        this.jsxBezierCurves[0].processMouseUp(e)
    }

    private handleMove(e: PointerEvent) {
        if (!this.state.justMoving || !this.jsxBezierCurves[0].isSelected()) {
            return
        }
        this.jsxBezierCurves[0].processMouseMove(e)
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
