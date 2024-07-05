import React from "react";
import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {Continuity} from "../../bezeg/impl/curve/bezier-spline";
import {Button} from "react-bootstrap";

class Graph extends BaseSplineCurveGraph {

    initialize() {
        const points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2]]
        this.createJSXSplineCurve(points, 3, Continuity.G1)
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([
            <div><Button variant={"dark"} onClick={() => this.povecajB1()}>Povečaj B1</Button>
                <Button variant={"dark"} onClick={() => this.zmanjsajB1()}>Zmanjšaj B1</Button></div>
        ])
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
