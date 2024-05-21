import React from 'react';
import '../../App.css';
import {Button} from "../../inputs/Button";
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";

export default class AffineTransformBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<div>
            <Button onClick={() => this.scale(1.2)} text={"Povečaj"}></Button>
            <Button onClick={() => this.scale(0.8)} text={"Pomanjšaj"}></Button></div>,
            <div><Button onClick={() => this.moveFor(-0.5, 0)} text={"Levo"}></Button>
                <Button onClick={() => this.moveFor(0.5, 0)} text={"Desno"}></Button></div>,
            <div><Button onClick={() => this.moveFor(0, 0.5)} text={"Gor"}></Button>
                <Button onClick={() => this.moveFor(0, -0.5)} text={"Dol"}></Button></div>,
            <div><Button onClick={() => this.rotate(0.10 * Math.PI)} text={"Rotiraj levo"}></Button>
                <Button onClick={() => this.rotate(-0.10 * Math.PI)} text={"Rotiraj desno"}></Button></div>,
            <div><Button onClick={() => this.flip(true, false)} text={"Zrcali Y"}></Button>
                <Button onClick={() => this.flip(false, true)} text={"Zrcali X"}></Button></div>
        ])
    }

    private moveFor(x: number, y: number) {
        this.getFirstCurve().moveFor(x, y)
        this.board.update()
    }

    private scale(scale: number) {
        this.getFirstCurve().scale(scale)
        this.board.update()
    }

    private rotate(number: number) {
        this.getFirstCurve().rotate(number)
        this.board.update()
    }

    private flip(b: boolean, b2: boolean) {
        this.getFirstCurve().flip(b, b2)
        this.board.update()
    }


}