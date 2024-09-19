import {HodographInputbox} from "./HodographInputBox";
import {JXGPointWrapper} from "../object/JXGPointWrapper";
import React from "react";
import {Button} from "react-bootstrap";
import {JXGBezierCurve} from "../object/JXGBezierCurve";
import {JXGPHBezierCurve} from "../object/JXGPHBezierCurve";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {BaseBezierCurveGraph} from "../../base/BaseBezierCurveGraph";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";
import Slider from "../../../inputs/Slider";
import {PhBezierCurve} from "../../../bezeg/impl/curve/ph-bezier-curve";

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
            return [];
        }
        const commands = [];
        commands.push(<OnOffSwitch
            initialState={this.getFirstJxgCurveAsPHCurve().isShowingOffsetCurve()}
            onChange={checked => {
                this.getFirstJxgCurveAsPHCurve().setShowOffsetCurve(checked);
                this.setState({...this.state, showOffsetCurve: checked});
            }}
            label={"Odmiki krivulje"}/>);

        if (this.state.showOffsetCurve) {
            commands.push(<Slider min={-3}
                                  max={3}
                                  initialValue={this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() ? this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() : 0}
                                  step={0.1}
                                  onChange={e => this.setOffsetCurveDistance(e)}/>);
            commands.push(<OnOffSwitch
                onChange={checked => {
                    this.getFirstJxgCurveAsPHCurve().setShowOffsetCurveControlPoints(checked);
                    this.setState({...this.state, showOffsetCurveControlPoints: checked});
                }}
                label={"Kontrolne točke offset krivulje"}
                initialState={this.state.showOffsetCurveControlPoints}/>);
            commands.push(<Button onClick={() => this.getFirstJxgCurveAsPHCurve().addOffsetCurve()}>Dodaj
                krivuljo</Button>);
            commands.push(<Button onClick={() => this.getFirstJxgCurveAsPHCurve().removeOffsetCurve()}>Odstrani
                krivuljo</Button>);
        }
        return super.getGraphCommands().concat(commands);
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        return super.getSelectedCurveCommands().concat(<HodographInputbox
            setRef={board => {
                this.setHodographBoard(board);
                this.initializeHodographs(this.getFirstCurveAsPHBezierCurve().w.map(p => [p.X(), p.Y()]));
            }}/>);
    }

    getFirstCurveAsPHBezierCurve() {
        return this.getFirstCurve() as PhBezierCurve;
    }

    override getFirstJxgCurve(): JXGBezierCurve {
        return super.getFirstJxgCurve() as JXGBezierCurve;
    }

    getFirstJxgCurveAsPHCurve(): JXGPHBezierCurve {
        return super.getFirstJxgCurve() as JXGPHBezierCurve;
    }

    private initializeHodographs(hodographs: number[][]) {
        const jxgGraphPoints = hodographs.map(((w, i) => this.hodographBoard.create('point', [w[0], w[1]], {name: "w_" + i})));
        const hodographPoints = jxgGraphPoints.map(point => new JXGPointWrapper(point));

        jxgGraphPoints.forEach(point => point.on("drag", () => {
            this.boardUpdate();
        }));
        this.board.addChild(this.hodographBoard);
        this.getFirstCurveAsPHBezierCurve().w = hodographPoints;
    }

    private setOffsetCurveDistance(e: number) {
        this.board.suspendUpdate();
        this.getFirstCurveAsPHBezierCurve().setOffsetCurveDistance(e);
        this.unsuspendBoardUpdate();
    }

    private setHodographBoard(board: JXG.Board) {
        if (this.hodographBoard) {
            this.board.removeChild(this.hodographBoard);
        }
        this.hodographBoard = board;
    }

    private scale(number: number) {
        this.board.suspendUpdate();
        this.getSelectedCurve().getCurve().scale(number, number);
        this.unsuspendBoardUpdate();
    }
}

export default BasePhBezierCurveGraph;
