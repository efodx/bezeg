import '../../App.css';
import {BaseBezierCurveGraph, BaseCurveGraphProps} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import Slider from "../../inputs/Slider";
import {HodographInputbox} from "./HodographInputBox";
import {Point} from "../object/Point";
import React from "react";
import {Button, Form} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {Colors} from "../bezier/utilities/Colors";
import {CurveStyles} from "../styles/CurveStyles";
import {CacheContext} from "../context/CacheContext";

export interface BasePhBezierCurveGraphStates extends BaseGraphStates {
    showOffsetCurve: boolean,
    showOffsetCurveControlPoints: boolean
}

abstract class BasePhBezierCurveGraph<P extends BaseCurveGraphProps, S extends BasePhBezierCurveGraphStates> extends BaseBezierCurveGraph<P, S> {

    private hodographBoard!: JXG.Board;
    private jsxOffsetCurves!: JXG.Curve[];
    private jxgOffsetControlPoints: JXG.Point[] = [];
    private jxgOffsetControlPointsLines: JXG.Line[] = [];

    get showOffsetCurve(): boolean {
        return this.state.showOffsetCurve;
    }

    set showOffsetCurve(show: boolean) {
        CacheContext.context = CacheContext.context + 1
        if (show) {
            this.jsxOffsetCurves.forEach(curve => curve.show())
        } else {
            this.jsxOffsetCurves.forEach(curve => curve.hide())
        }
        this.setState({
            ...this.state,
            showOffsetCurve: show
        })
    }

    override getInitialState(): S {
        return {
            ...super.getInitialState(),
            showOffsetCurve: false,
            showOffsetCurveControlPoints: false
        };
    }

    override initialize() {
        super.initialize()
        this.generateJsxOffsetCurves(true);
    }

    override getGraphCommands(): JSX.Element[] {
        const commands = []
        commands.push(<Form> <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Offset krivulje"
            checked={this.showOffsetCurve}
            onChange={() => this.showOffsetCurve = !this.showOffsetCurve}/>
        </Form>)


        if (this.showOffsetCurve) {
            commands.push(<Slider min={-3}
                                  max={3}
                                  initialValue={this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() ? this.getFirstCurveAsPHBezierCurve()?.getOffsetCurveDistance() : 0}
                                  step={0.1}
                                  onChange={e => this.setOffsetCurveDistance(e)}/>)
            commands.push(<OnOffSwitch onChange={checked => this.showOffsetCurveControlPoints(checked)}
                                       label={"Kontrolne točke offset krivulje"}
                                       initialState={this.state.showOffsetCurveControlPoints}/>)
            commands.push(<Button variant={"dark"} onClick={() => this.addOffsetCurve()}>Dodaj krivuljo</Button>)
            commands.push(<Button variant={"dark"} onClick={() => this.removeOffsetCurve()}>Odstrani krivuljo</Button>)
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

    private generateJsxOffsetCurves(hide?: boolean) {
        this.board.removeObject(this.jsxOffsetCurves)
        this.jsxOffsetCurves = []
        this.jsxOffsetCurves = this.getFirstCurveAsPHBezierCurve().getOffsetCurves().map(curve => this.board.create('curve',
            [(t: number) => {
                return curve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return curve.calculatePointAtT(t).Y();
                },
                0,
                1
            ], CurveStyles.default
        ));
        if (hide) {
            this.jsxOffsetCurves.forEach(curve => curve.hide())
        }
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


    private showOffsetCurveControlPoints(checked: boolean) {
        this.board.removeObject(this.jxgOffsetControlPoints)
        this.board.removeObject(this.jxgOffsetControlPointsLines)
        this.jxgOffsetControlPoints = []
        this.jxgOffsetControlPointsLines = []
        if (checked) {
            this.generateJxgOffsetCurveControlPoints();
        }
        this.setState({...this.state, showOffsetCurveControlPoints: checked})
    }

    private addOffsetCurve() {
        this.board.suspendUpdate()
        this.getFirstCurveAsPHBezierCurve().addOffsetCurve()
        this.generateJsxOffsetCurves()
        this.showOffsetCurveControlPoints(this.state.showOffsetCurveControlPoints)
        this.board.unsuspendUpdate()
    }

    private removeOffsetCurve() {
        this.board.suspendUpdate()
        this.getFirstCurveAsPHBezierCurve().removeOffsetCurve()
        this.generateJsxOffsetCurves()
        this.showOffsetCurveControlPoints(this.state.showOffsetCurveControlPoints)
        this.board.unsuspendUpdate()
    }


    private generateLinesBetweenOffsetCurvePoints() {
        const numOfLines = this.getFirstCurveAsPHBezierCurve().getOffsetCurves()[0].getPoints().length
        for (let i = 0; i < numOfLines; i++) {
            const offsetLine = this.board.create('line', [this.jxgOffsetControlPoints[i], this.jxgOffsetControlPoints[i + numOfLines]], {
                color: Colors[i]
            });
            this.jxgOffsetControlPointsLines.push(offsetLine)
        }
    }

    private generateJxgOffsetCurveControlPoints() {
        this.getFirstCurveAsPHBezierCurve().getOffsetCurves().forEach(curve => {
            let jxgOffsetControlPoints = curve.getPoints().map((point, r) => this.board.create('point', [() => point.X(), () => point.Y()], {
                // @ts-ignore
                style: JXG.POINT_STYLE_X,
                color: Colors[r]
            }))
            // @ts-ignore
            this.jxgOffsetControlPoints.push(...jxgOffsetControlPoints)
        })
        this.generateLinesBetweenOffsetCurvePoints()
    }
}

export default BasePhBezierCurveGraph;
