import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph} from "./BaseCurveGraph";

export default class AffineTransformBezierCurveGraph extends BaseCurveGraph {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }

    protected getAdditionalCommands(): JSX.Element {
        return <div>
            <div>
                <Button onClick={() => this.scale(1.2)} text={"Povečaj"}></Button>
                <Button onClick={() => this.scale(0.8)} text={"Pomanjšaj"}></Button></div>
            <div><Button onClick={() => this.moveFor(-0.5, 0)} text={"Levo"}></Button>
                <Button onClick={() => this.moveFor(0.5, 0)} text={"Desno"}></Button></div>
            <div><Button onClick={() => this.moveFor(0, 0.5)} text={"Gor"}></Button>
                <Button onClick={() => this.moveFor(0, -0.5)} text={"Dol"}></Button></div>
            <div><Button onClick={() => this.rotate(0.10 * Math.PI)} text={"Rotiraj levo"}></Button>
                <Button onClick={() => this.rotate(-0.10 * Math.PI)} text={"Rotiraj desno"}></Button></div>
            <div><Button onClick={() => this.flip(true, false)} text={"Zrcali Y"}></Button>
                <Button onClick={() => this.flip(false, true)} text={"Zrcali X"}></Button></div>
        </div>;
    }

    private moveFor(x: number, y: number) {
        this.jsxBezierCurves[0].getBezierCurve().moveFor(x, y)
        this.board.update()
    }

    private scale(scale: number) {
        this.jsxBezierCurves[0].getBezierCurve().scale(scale)
        this.board.update()
    }

    private rotate(number: number) {
        this.jsxBezierCurves[0].getBezierCurve().rotate(number)
        this.board.update()
    }

    private flip(b: boolean, b2: boolean) {
        this.jsxBezierCurves[0].getBezierCurve().flip(b, b2)
        this.board.update()
    }


}