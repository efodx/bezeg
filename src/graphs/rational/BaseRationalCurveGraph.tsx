import BaseCurveGraph, {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";
import {RationalBezierCurve} from "../../bezeg/impl/curve/rational-bezier-curve";
import {JSXRationalBezierCurve} from "./JSXRationalBezierCurve";
import Slider from "../../inputs/Slider";
import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

interface BaseRationalBezierCurveGraphProps extends BaseGraphProps {

}

interface BaseRationalBezierCurveGraphState extends BaseGraphStates {
    currentWeight: number
}

export abstract class BaseRationalCurveGraph<P extends BaseRationalBezierCurveGraphProps, S extends BaseRationalBezierCurveGraphState> extends BaseCurveGraph<RationalBezierCurve, JSXRationalBezierCurve, P, S> {
    protected weightNumber: number = 1;
    private subdivisionT: number = 0.5;
    private extrapolationT: number = 1.2;
    private subdivisionPoint: JXG.Point | null = null;
    private extrapolationPoint: JXG.Point | null = null;

    newJSXBezierCurve(points: number[][]): JSXRationalBezierCurve {
        return new JSXRationalBezierCurve(points, [], this.board);
    }

    createRationalJSXBezierCurve(points: number[][], weights: number[]): JSXRationalBezierCurve {
        let curve = super.createJSXBezierCurve(points);
        curve.getCurve().setWeights(weights)
        return curve
    }


    override getSelectedCurveCommands(): JSX.Element[] {
        this.createSubdivisionPoint()
        this.createExtrapolationPoint()
        return super.getSelectedCurveCommands().concat([
            <div onMouseEnter={() => this.showSubdivisionPoint()}
                 onMouseLeave={() => this.hideSubdivisionPoint()}><Slider min={0} max={1}
                                                                          initialValue={this.subdivisionT}
                                                                          onChange={(t) => this.setSubdivisionT(t)}></Slider>
                <Button variant={"dark"} onClick={() => this.subdivideSelectedCurve()}>Subdiviziraj</Button></div>,
            <div onMouseEnter={() => this.showExtrapolationPoint()}
                 onMouseLeave={() => this.hideExtrapolationPoint()}>
                <Slider min={1} max={1.5}
                        initialValue={this.extrapolationT}
                        onChange={(t) => this.setExtrapolationT(t)}></Slider>
                <Button variant={"dark"} onClick={() => this.extrapolateSelectedCurve()}>Ekstrapoliraj</Button></div>,
            <div>
                <Button variant={"dark"} onClick={() => this.elevateSelectedCurve()}>Dvigni stopnjo</Button></div>,

            <div>
                <OnOffSwitch initialState={this.getFirstJsxCurve().isShowingWeights()}
                             onChange={(checked) => this.showWeights(checked)} label={"Uteži"}/>
                <ButtonGroup vertical={true}>
                    <Button variant={"dark"} className="btn-block" onClick={() => this.changeWeight(0.25)}>+</Button>

                    <ButtonGroup>
                        <Button variant={"dark"} className="btn-block" onClick={() => this.prevWeight()}>{"<"}</Button>
                        <Button onClick={() => this.resetWeight()}
                                className="btn-block">{this.state.currentWeight.toFixed(2)}</Button>
                        <Button variant={"dark"} onClick={() => this.nextWeight()} className="btn-block">{">"}</Button>
                    </ButtonGroup> <Button variant={"dark"} onClick={() => this.changeWeight(-0.25)}
                                           className="btn-block">-</Button>
                </ButtonGroup>
                <OnOffSwitch initialState={this.getFirstJsxCurve().inStandardForm()}
                             onChange={(checked) => this.setStandardForm(checked)} label={"Standardna Forma"}/>

            </div>
        ]);
    }

    showSubdivisionPoint() {
        this.subdivisionPoint?.show()
    }

    hideSubdivisionPoint() {
        this.subdivisionPoint?.hide()
    }

    showExtrapolationPoint() {
        this.getSelectedCurve().setIntervalEnd(() => this.extrapolationT)
        this.extrapolationPoint?.show()
    }

    hideExtrapolationPoint() {
        this.getSelectedCurve().setIntervalEnd(1)
        this.extrapolationPoint?.hide()
    }

    extrapolateSelectedCurve() {
        this.board.suspendUpdate()
        this.getSelectedCurve().extrapolate(this.extrapolationT)
        this.unsuspendBoardUpdate()
    }

    subdivideSelectedCurve() {
        this.board.suspendUpdate()
        let newCurve = this.getSelectedCurve().subdivide(this.subdivisionT)
        this.jsxBezierCurves.push(newCurve);
        this.deselectSelectedCurve()
        this.unsuspendBoardUpdate()
    }

    elevateSelectedCurve() {
        this.board.suspendUpdate()
        this.getSelectedCurve().elevate()
        if (this.getSelectedCurve().isShowingControlPolygon()) {
            this.getSelectedCurve().showControlPolygon()
        }
        this.unsuspendBoardUpdate()
    }

    override deselectSelectedCurve() {
        if (this.subdivisionPoint) {
            // @ts-ignore
            this.board.removeObject(this.subdivisionPoint)
        }
        if (this.extrapolationPoint) {
            this.board.removeObject(this.extrapolationPoint)
        }
        this.getSelectedCurve().getJxgPoints()[this.weightNumber].setAttribute({
            color: "#D55E00"
        })
        super.deselectSelectedCurve();

        this.subdivisionPoint = null
        this.extrapolationPoint = null
    }

    nextWeight() {
        this.setSelectedWeight(this.weightNumber + 1)
    }

    prevWeight() {
        this.setSelectedWeight(this.weightNumber - 1)
    }

    setSelectedWeight(i: number) {
        this.getSelectedCurve().getJxgPoints()[this.weightNumber].setAttribute({
            color: "#D55E00"
        })
        if (i > this.getSelectedCurve().getCurve().getWeights().length - 1) {
            this.weightNumber = 0;
        } else if (i < 0) {
            this.weightNumber = this.getSelectedCurve().getCurve().getWeights().length - 1;
        } else {
            this.weightNumber = i;
        }
        this.getSelectedCurve().getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow  "
        })
        this.refreshWeightState()
        this.board.update()
    }

    override selectCurve(selectableCurve: JSXRationalBezierCurve) {
        super.selectCurve(selectableCurve, {currentWeight: selectableCurve.getCurve()!.getWeights()[this.weightNumber]})
        selectableCurve.getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow"
        })
    }

    changeWeight(dw: number) {
        this.setWeight(this.getSelectedCurve().getCurve().getWeights()[this.weightNumber] + dw)
    }

    setWeight(w: number) {
        let newWeights = this.getSelectedCurve().getCurve().getWeights().map(i => i)
        newWeights[this.weightNumber] = w
        this.getSelectedCurve().getCurve().setWeights(newWeights)
        this.refreshWeightState()
        this.board.update()
    }

    resetWeight() {
        this.setWeight(1)
    }

    refreshWeightState() {
        if (this.getSelectedCurve() === undefined) {
            return
        }
        this.setState({
            ...this.state,
            currentWeight: this.getSelectedCurve().getCurve()!.getWeights()[this.weightNumber]
        })
    }

    showWeights(show: boolean) {
        const curve = this.getSelectedCurve() ? this.getSelectedCurve() : this.getFirstJsxCurve()
        if (show) {
            curve.showWeights()
        } else {
            curve.hideWeights()
        }
    }

    protected setStandardForm(standard: boolean) {
        this.getFirstCurve()!.setStandardForm(standard)
        this.refreshWeightState()
        this.board.update()
    }

    private setSubdivisionT(t: number) {
        this.subdivisionT = t
        this.board.update()
    }

    private setExtrapolationT(t: number) {
        this.extrapolationT = t
        this.board.update()
    }

    private createSubdivisionPoint() {
        if (this.board && !this.subdivisionPoint && this.getSelectedCurve()) {
            this.subdivisionPoint = this.board.create('point', [() => this.getSelectedCurve().getCurve().calculatePointAtT(this.subdivisionT).X(),
                () => this.getSelectedCurve().getCurve().calculatePointAtT(this.subdivisionT).Y()]);
            this.subdivisionPoint.hide()
        }
    }

    private createExtrapolationPoint() {
        if (this.board && !this.extrapolationPoint && this.getSelectedCurve()) {
            this.extrapolationPoint = this.board.create('point', [() => this.getSelectedCurve().getCurve().calculatePointAtT(this.extrapolationT).X(),
                () => this.getSelectedCurve().getCurve().calculatePointAtT(this.extrapolationT).Y()]);
            this.extrapolationPoint.hide()
        }
    }
}

export type {BaseRationalBezierCurveGraphProps, BaseRationalBezierCurveGraphState}