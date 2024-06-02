import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";
import {PhBezierCurve} from "../../bezeg/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import {HodographInputbox} from "./HodographInputBox";
import {Point} from "../base/Point";
import React from "react";
import {Button, Form} from "react-bootstrap";
import {CacheContext} from "../../Contexts";

interface BasePhBezierCurveGraphStates extends BaseGraphStates {
    showOffsetCurve: boolean
}

abstract class BasePhBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BasePhBezierCurveGraphStates> {

    private hodographBoard!: JXG.Board;
    private jsxOffsetCurve!: JXG.Curve;
    private hodographBoardElement = <HodographInputbox setRef={board => this.setHodographBoard(board)}/>


    get showOffsetCurve(): boolean {
        return this.state.showOffsetCurve;
    }

    set showOffsetCurve(show: boolean) {
        CacheContext.context = CacheContext.context + 1
        if (show) {
            this.jsxOffsetCurve.show()
        } else {
            this.jsxOffsetCurve.hide()
        }
        this.setState({
            ...this.state,
            showOffsetCurve: show
        })
    }

    abstract getStartingPoints(): number[][];

    abstract getStartingHodographs(): number[][];

    override getInitialState(): BasePhBezierCurveGraphStates {
        return {
            ...super.getInitialState(),
            showOffsetCurve: false
        };
    }


    initialize() {
        const points = this.getStartingPoints()
        const hodographs = this.getStartingHodographs()
        this.createJSXBezierCurve(points.concat(hodographs))

        this.jsxOffsetCurve = this.board.create('curve',
            [(t: number) => {
                return this.getFirstCurveAsPHBezierCurve().getOffsetCurve().calculatePointAtT(t).X();
            },
                (t: number) => {
                    return this.getFirstCurveAsPHBezierCurve().getOffsetCurve().calculatePointAtT(t).Y();
                },
                0,
                1
            ]
        );
        this.jsxOffsetCurve.hide()
    }


    override newJSXBezierCurve(points: number[][]): JSXPHBezierCurve {
        return new JSXPHBezierCurve(points, this.board);
    }

    override getGraphCommands(): JSX.Element[] {
        const commands = []
        commands.push(<Form> <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Offset krivulja"
            checked={this.showOffsetCurve}
            onChange={() => this.showOffsetCurve = !this.showOffsetCurve}/>
        </Form>)


        if (this.showOffsetCurve) {
            commands.push(<Slider min={-3}
                                  max={3}
                                  initialValue={this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() ? this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() : 0}
                                  step={0.1}
                                  onChange={e => this.setOffsetCurveDistance(e)}/>)
        }
        return super.getGraphCommands().concat(commands);
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat(<HodographInputbox
                setRef={board => {
                    this.setHodographBoard(board)
                    this.initializeHodographs(this.getFirstCurveAsPHBezierCurve().w.map(p => [p.X(), p.Y()]))
                }}/>, <Button variant={"dark"}
                              onClick={() => this.scale(1.2)}>Povečaj</Button>,
            <Button variant={"dark"} onClick={() => this.scale(0.8)}>Pomanjšaj</Button>);
    }

    getFirstCurveAsPHBezierCurve() {
        return this.getFirstCurve() as PhBezierCurve
    }


    private initializeHodographs(hodographs: number[][]) {
        if (this.hodographBoard == undefined) {
            setTimeout(() => this.initializeHodographs(hodographs), 10)
            return
        }
        const jxgGraphPoints = hodographs.map(w => this.hodographBoard.create('point', [w[0], w[1]]))
        const hodographPoints = jxgGraphPoints.map(point => new Point(point))

        jxgGraphPoints.forEach(point => point.on("drag", () => {
            this.board.update()
        }))
        this.board.addChild(this.hodographBoard)
        this.getFirstCurveAsPHBezierCurve().w = hodographPoints
    }

    private setOffsetCurveDistance(e: number) {
        this.board.suspendUpdate()
        this.getFirstCurveAsPHBezierCurve().setOffsetCurveDistance(e);
        this.unsuspendBoardUpdate()
    }

    private setHodographBoard(board: JXG.Board) {
        if (this.hodographBoard) {
            this.board.removeChild(this.hodographBoard)
        }
        this.hodographBoard = board
    }

    private scale(number: number) {
        this.board.suspendUpdate()
        this.getSelectedCurve().getCurve().scale(number, number)
        this.unsuspendBoardUpdate()
    }
}

export default BasePhBezierCurveGraph;
