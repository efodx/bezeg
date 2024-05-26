import React from 'react';
import '../../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "../base/BaseCurveGraph";
import {BaseGraphStates} from "../base/BaseGraph";
import {Button} from "react-bootstrap";

export default class AffineTransformBezierCurveGraph extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        this.createJSXBezierCurve(points)
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<div>
            <Button variant={"dark"} onClick={() => this.scale(1.2)}>Povečaj</Button>
            <Button variant={"dark"} onClick={() => this.scale(0.8)}>Pomanjšaj</Button></div>,
            <div><Button variant={"dark"} onClick={() => this.moveFor(-0.5, 0)}>Levo</Button>
                <Button variant={"dark"} onClick={() => this.moveFor(0.5, 0)}>Desno</Button></div>,
            <div><Button variant={"dark"} onClick={() => this.moveFor(0, 0.5)}>Gor</Button>
                <Button variant={"dark"} onClick={() => this.moveFor(0, -0.5)}>Dol</Button></div>,
            <div><Button variant={"dark"} onClick={() => this.rotate(0.10 * Math.PI)}>Rotiraj levo</Button>
                <Button variant={"dark"} onClick={() => this.rotate(-0.10 * Math.PI)}>Rotiraj desno</Button></div>,
            <div><Button variant={"dark"} onClick={() => this.flip(true, false)}>Zrcali Y</Button>
                <Button variant={"dark"} onClick={() => this.flip(false, true)}>Zrcali X</Button></div>
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