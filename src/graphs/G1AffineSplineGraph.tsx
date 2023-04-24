import React from "react";
import {BezierSpline} from "../bezeg/bezier-spline";
import {Button} from "../inputs/Button";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";

class Graph extends BaseSplineCurveGraph {
    private spline: BezierSpline = null as unknown as BezierSpline;

    initialize() {
        this.createJSXSplineCurve([[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]], 3, 1)
    }

    protected getAdditionalCommands(): JSX.Element {
        return <div>
            <div><Button text={"Povečaj B1"} onClick={() => this.povecajB1()}></Button>
                <Button text={"Zmanjšaj B1"} onClick={() => this.zmanjsajB1()}></Button></div>
            <div><Button text={"Povečaj B2"} onClick={() => this.povecajB2()}></Button>
                <Button text={"Zmanjšaj B2"} onClick={() => this.zmanjsajB2()}></Button>
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
        </div>
    }

    private povecajB1() {
        this.spline.setB(0, this.spline.getB(0) * 1.1)
        this.board.update()
    }

    private zmanjsajB1() {
        this.spline.setB(0, this.spline.getB(0) * 0.9)
        this.board.update()
    }


    private povecajB2() {
        this.spline.setB(1, this.spline.getB(1) * 1.1)
        this.board.update()
    }

    private zmanjsajB2() {
        this.spline.setB(1, this.spline.getB(1) * 0.9)
        this.board.update()
    }

    private moveFor(x: number, y: number) {
        this.spline.moveFor(x, y)
        this.board.update()
    }

    private scale(scale: number) {
        this.spline.scale(scale)
        this.board.update()
    }

    private rotate(number: number) {
        this.spline.rotate(number)
        this.board.update()
    }

    private flip(b: boolean, b2: boolean) {
        this.spline.flip(b, b2)
        this.board.update()
    }

}

export default Graph;
