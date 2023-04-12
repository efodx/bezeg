import {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {Point} from "./Point";

/**
 * Abstract class for creating graphs.
 * Every subclass of this class must render a JGBox element.
 */
abstract class BaseGraph extends Component<any, any> {
    protected board: Board;
    protected points: JXG.Point[] = [];

    protected constructor(props: any) {
        super(props);
        this.board = null as unknown as Board;
    }

    componentDidMount() {
        this.board = JSXGraph.initBoard("jgbox", {
            showFullscreen: true, boundingbox: [-5, 5, 5, -5], axis: true
        });
        this.initialize()
    }

    abstract initialize(): void;

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
        this.points.push(point)
        return new Point(point);
    }

    // TODO change e to pointerevent
    getMouseCoords(e: any) {
        const pos = this.board.getMousePosition(e);
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);
    }
}

export default BaseGraph;
