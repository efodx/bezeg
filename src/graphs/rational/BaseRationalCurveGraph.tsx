import BaseGraph, {BaseGraphProps, BaseGraphStates} from "../base/BaseGraph";
import {RationalBezierCurve} from "../../bezeg/rational-bezier-curve";
import {JSXRationalBezierCurve} from "./JSXRationalBezierCurve";
import Slider from "../../inputs/Slider";
import {Button} from "../../inputs/Button";
import React from "react";

const curveCommandStyle = {
    padding: "10px",
    border: "white",
    borderStyle: "solid",
    borderRadius: "5px",
    borderWidth: "2px",
    margin: "5px"
}

interface BaseRationalBezierCurveGraphProps extends BaseGraphProps {

}

interface BaseRationalBezierCurveGraphState extends BaseGraphStates {
    currentWeight: number
}

export abstract class BaseRationalCurveGraph<P extends BaseRationalBezierCurveGraphProps, S extends BaseRationalBezierCurveGraphState> extends BaseGraph<RationalBezierCurve, JSXRationalBezierCurve, P, S> {
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
            <div style={curveCommandStyle} onMouseEnter={() => this.showSubdivisionPoint()}
                 onMouseLeave={() => this.hideSubdivisionPoint()}><Slider min={0} max={1}
                                                                          initialValue={this.subdivisionT}
                                                                          onChange={(t) => this.setSubdivisionT(t)}></Slider>
                <Button
                    text={"Subdiviziraj"} onClick={() => this.subdivideSelectedCurve()}></Button></div>,
            <div style={curveCommandStyle} onMouseEnter={() => this.showExtrapolationPoint()}
                 onMouseLeave={() => this.hideExtrapolationPoint()}>
                <Slider min={1} max={1.5}
                        initialValue={this.extrapolationT}
                        onChange={(t) => this.setExtrapolationT(t)}></Slider>
                <Button
                    text={"Ekstrapoliraj"} onClick={() => this.extrapolateSelectedCurve()}></Button></div>,
            <div style={curveCommandStyle}>
                <Button text={"Dvigni stopnjo"} onClick={() => this.elevateSelectedCurve()}></Button></div>,

            <div style={curveCommandStyle}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button onClick={() => this.changeWeight(1.1)} text={"Dodaj težo"}/>
                    <div style={{color: "white"}}>{this.state.currentWeight}</div>
                    <Button onClick={() => this.changeWeight(0.9)} text={"Zmanjšaj težo"}/>
                </div>
                <Button onClick={() => this.nextWeight()} text={"Naslednja Točka"}/>
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
        this.board.unsuspendUpdate()
    }

    subdivideSelectedCurve() {
        this.board.suspendUpdate()
        let newCurve = this.getSelectedCurve().subdivide(this.subdivisionT)
        this.jsxBezierCurves.push(newCurve);
        this.deselectSelectedCurve()
        this.board.unsuspendUpdate()
    }

    elevateSelectedCurve() {
        this.board.suspendUpdate()
        this.getSelectedCurve().elevate()
        if (this.getSelectedCurve().isShowingControlPolygon()) {
            this.getSelectedCurve().showControlPolygon()
        }
        this.board.unsuspendUpdate()
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
            color: "red"
        })
        super.deselectSelectedCurve();

        this.subdivisionPoint = null
        this.extrapolationPoint = null
    }

    nextWeight() {
        this.getSelectedCurve().getJxgPoints()[this.weightNumber].setAttribute({
            color: "red"
        })
        if (this.weightNumber === this.getSelectedCurve().getCurve().getWeights().length - 1) {
            this.weightNumber = 0;
        } else {
            this.weightNumber = this.weightNumber + 1;
        }

        this.getSelectedCurve().getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow  "
        })
        this.refreshWeightState()
        this.board.update()
    }

    override selectCurve(selectableCurve: JSXRationalBezierCurve) {
        super.selectCurve(selectableCurve)
        selectableCurve.getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow"
        })
    }

    changeWeight(dw: number) {
        if (this.weightNumber > this.getSelectedCurve().getCurve().getWeights().length) {
            this.weightNumber = 0
        }
        console.log("BEFORE")
        console.log(JSON.stringify(this.getSelectedCurve().getCurve().getWeights()))
        let newWeights = this.getSelectedCurve().getCurve().getWeights().map(i => i)
        newWeights[this.weightNumber] = Math.round(100 * this.getSelectedCurve().getCurve().getWeights()[this.weightNumber] * dw) / 100
        this.getSelectedCurve().getCurve().getWeights()[this.weightNumber] = Math.round(100 * this.getSelectedCurve().getCurve().getWeights()[this.weightNumber] * dw) / 100
        this.getSelectedCurve().getCurve().setWeights(newWeights)
        console.log("AFTER")
        console.log(JSON.stringify(this.getSelectedCurve().getCurve().getWeights()))
        this.refreshWeightState()
        this.board.update()
    }

    refreshWeightState() {
        console.log("SETTIN STATE TO: ")
        console.log(JSON.stringify(this.getSelectedCurve().getCurve().getWeights()[this.weightNumber]))
        this.setState({
            ...this.state,
            currentWeight: this.getSelectedCurve().getCurve()!.getWeights()[this.weightNumber]
        })
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