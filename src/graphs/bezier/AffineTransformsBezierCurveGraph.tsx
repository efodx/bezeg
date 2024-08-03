import React from 'react';

import {BaseBezierCurveGraph} from "../base/BaseBezierCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";
import {Button} from "react-bootstrap";
import {Attributes} from "../attributes/Attributes";

export default class AffineTransformBezierCurveGraph extends BaseBezierCurveGraph<any, BaseGraphStates> {
    override initialize() {
        super.initialize();
        this.getFirstJsxCurve().setAttributes(Attributes.bezierDisabled)
    }


    override presets(): string {
        return "affine-transform"
    }

    defaultPreset(): any {
        return [["JSXBezierCurve", {
            "points": [[-3, 2], [0, -2], [1, 2], [3, -2]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2
            }
        }]]
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<div>
            <Button onClick={() => this.scale(1.2)}>+</Button>
            <Button onClick={() => this.scale(0.8)}>-</Button></div>,
            <div><Button onClick={() => this.moveFor(-0.5, 0)}>⇐</Button>
                <Button onClick={() => this.moveFor(0.5, 0)}>⇒</Button></div>,
            <div><Button onClick={() => this.moveFor(0, 0.5)}>⇑</Button>
                <Button onClick={() => this.moveFor(0, -0.5)}>⇓</Button></div>,
            <div><Button onClick={() => this.rotate(-0.10 * Math.PI)}>↻</Button>
                <Button onClick={() => this.rotate(0.10 * Math.PI)}>↺</Button></div>,
            <div><Button onClick={() => this.flip(true, false)}>Zrcali Y</Button>
                <Button onClick={() => this.flip(false, true)}>Zrcali X</Button></div>])
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