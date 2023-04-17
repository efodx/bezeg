import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import React from "react";
import {BezierSpline} from "../bezeg/bezier-spline";
import {Button} from "../inputs/Button";

class Graph extends BaseRationalCurveGraph {
    private spline: BezierSpline = null as unknown as BezierSpline;

    initialize() {
        //this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
        let points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]].map(p => this.createJSXGraphPoint(p[0], p[1]))
        let spline = new BezierSpline(points, 3, 0.5)
        this.spline = spline
        spline.getNonFreePoints().map(p => this.createJSXGraphPoint(() => p.X(), () => p.Y(), {
            fixed: true,
            color: "blue"
        }))

        this.board.create('curve',
            [(t: number) => {
                return spline.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return spline.calculatePointAtT(t).Y();
                },
                0, 1]
        );
    }

    protected getAdditionalCommands(): JSX.Element {
        return <div>
            <div><Button text={"Povečaj B1"} onClick={() => this.povecajB1()}></Button>
                <Button text={"Zmanjšaj B1"} onClick={() => this.zmanjsajB1()}></Button></div>
            <div><Button text={"Povečaj B2"} onClick={() => this.povecajB2()}></Button>
                <Button text={"Zmanjšaj B2"} onClick={() => this.zmanjsajB2()}></Button></div>
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
}

export default Graph;
