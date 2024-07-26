import '../../App.css';
import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import {HodographInputbox} from "./HodographInputBox";
import {Point} from "../object/Point";
import React from "react";
import {Button} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {JSXBezierCurve} from "../object/JSXBezierCurve";
import {JSXPHBezierCurve} from "../object/JSXPHBezierCurve";

export interface BasePhBezierCurveGraphStates extends BaseGraphStates {
    showOffsetCurve: boolean,
    showOffsetCurveControlPoints: boolean
}

abstract class BasePhBezierCurveGraph<P, S extends BasePhBezierCurveGraphStates> extends BaseBezierCurveGraph<P, S> {

    private hodographBoard!: JXG.Board;

    override getInitialState(): S {
        return {
            ...super.getInitialState(),
            showOffsetCurve: false,
            showOffsetCurveControlPoints: false
        };
    }

    override getGraphCommands(): JSX.Element[] {
        if (!this.state.initialized) {
            return []
        }
        const commands = []
        commands.push(<OnOffSwitch
            initialState={this.getFirstJsxCurveAsPHCurve().isShowingOffsetCurve()}
            onChange={checked => {
                this.getFirstJsxCurveAsPHCurve().setShowOffsetCurve(checked)
                this.setState({...this.state, showOffsetCurve: checked})
            }}
            label={"Offset krivulje"}/>)


        if (this.state.showOffsetCurve) {
            commands.push(<Slider min={-3}
                                  max={3}
                                  initialValue={this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() ? this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() : 0}
                                  step={0.1}
                                  onChange={e => this.setOffsetCurveDistance(e)}/>)
            commands.push(<OnOffSwitch
                onChange={checked => {
                    this.getFirstJsxCurveAsPHCurve().setShowOffsetCurveControlPoints(checked)
                    this.setState({...this.state, showOffsetCurveControlPoints: checked})
                }}
                label={"Kontrolne točke offset krivulje"}
                initialState={this.state.showOffsetCurveControlPoints}/>)
            commands.push(<Button variant={"dark"} onClick={() => this.getFirstJsxCurveAsPHCurve().addOffsetCurve()}>Dodaj
                krivuljo</Button>)
            commands.push(<Button variant={"dark"} onClick={() => this.getFirstJsxCurveAsPHCurve().removeOffsetCurve()}>Odstrani
                krivuljo</Button>)
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

    override getFirstJsxCurve(): JSXBezierCurve {
        return super.getFirstJsxCurve() as JSXBezierCurve
    }

    getFirstJsxCurveAsPHCurve(): JSXPHBezierCurve {
        return super.getFirstJsxCurve() as JSXPHBezierCurve
    }

    private initializeHodographs(hodographs: number[][]) {
        if (this.hodographBoard === undefined) {
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
