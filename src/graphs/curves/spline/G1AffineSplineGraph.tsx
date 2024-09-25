import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphStates} from "../../base/BaseCurveGraph";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<div><Button onClick={() => this.povecajB1()}>Povečaj
            B1</Button>
            <Button onClick={() => this.zmanjsajB1()}>Zmanjšaj B1</Button></div>,
            <div><Button onClick={() => this.povecajB2()}>Povečaj B2</Button>
                <Button onClick={() => this.zmanjsajB2()}>Zmanjšaj B2</Button>
                <Button onClick={() => this.scale(1.2)}>Povečaj</Button>
                <Button onClick={() => this.scale(0.8)}>Pomanjšaj</Button></div>,
            <div><Button onClick={() => this.moveFor(-0.5, 0)}>Levo</Button>
                <Button onClick={() => this.moveFor(0.5, 0)}>Desno</Button></div>,
            <div><Button onClick={() => this.moveFor(0, 0.5)}>Gor</Button>
                <Button onClick={() => this.moveFor(0, -0.5)}>Dol</Button></div>,
            <div><Button onClick={() => this.rotate(0.10 * Math.PI)}>Rotiraj levo</Button>
                <Button onClick={() => this.rotate(-0.10 * Math.PI)}>Rotiraj desno</Button></div>,
            <div><Button onClick={() => this.flip(true, false)}>Zrcali Y</Button>
                <Button onClick={() => this.flip(false, true)}>Zrcali X</Button></div>]);
    }

    override presets() {
        return "g1-spline";
    }

    defaultPreset(): any {
        return [["JSXQuadraticG1SplineCurve", {
            "points": [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2]], "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    private povecajB1() {
        this.getFirstCurve().setB(0, this.getFirstCurve().getB(0) * 1.1);
        this.boardUpdate();
    }

    private zmanjsajB1() {
        this.getFirstCurve().setB(0, this.getFirstCurve().getB(0) * 0.9);
        this.boardUpdate();
    }

    private povecajB2() {
        this.getFirstCurve().setB(1, this.getFirstCurve().getB(1) * 1.1);
        this.boardUpdate();
    }

    private zmanjsajB2() {
        this.getFirstCurve().setB(1, this.getFirstCurve().getB(1) * 0.9);
        this.boardUpdate();
    }

    private moveFor(x: number, y: number) {
        this.getFirstCurve().moveFor(x, y);
        this.boardUpdate();
    }

    private scale(scale: number) {
        this.getFirstCurve().scale(scale);
        this.boardUpdate();
    }

    private rotate(number: number) {
        this.getFirstCurve().rotate(number);
        this.boardUpdate();
    }

    private flip(b: boolean, b2: boolean) {
        this.getFirstCurve().flip(b, b2);
        this.boardUpdate();
    }

}

export default Graph;
