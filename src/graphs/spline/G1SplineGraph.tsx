import React from "react";
import {Button} from "../../inputs/Button";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Continuity} from "../../bezeg/bezier-spline";

class Graph extends BaseSplineCurveGraph {

    initialize() {
        let points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1], [3, -1.3], [3, -1.9]]
        this.createJSXSplineCurve(points, 3, Continuity.G1)
    }

    getGraphCommands(): JSX.Element[] {
        return [
            <div><Button text={"Povečaj B1"} onClick={() => this.povecajB1()}></Button>
                <Button text={"Zmanjšaj B1"} onClick={() => this.zmanjsajB1()}></Button></div>,
            <div><Button text={"Povečaj B2"} onClick={() => this.povecajB2()}></Button>
                <Button text={"Zmanjšaj B2"} onClick={() => this.zmanjsajB2()}></Button></div>
        ]
    }

    private povecajB1() {
        this.getFirstCurve().setB(0, this.getFirstCurve().getB(0) * 1.1)
        this.board.update()
    }

    private zmanjsajB1() {
        this.getFirstCurve().setB(0, this.getFirstCurve().getB(0) * 0.9)
        this.board.update()
    }


    private povecajB2() {
        this.getFirstCurve().setB(1, this.getFirstCurve().getB(1) * 1.1)
        this.board.update()
    }

    private zmanjsajB2() {
        this.getFirstCurve().setB(1, this.getFirstCurve().getB(1) * 0.9)
        this.board.update()
    }
}

export default Graph;
