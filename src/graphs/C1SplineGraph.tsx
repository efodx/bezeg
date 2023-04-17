import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import React from "react";
import {BezierSpline} from "../bezeg/bezier-spline";

class Graph extends BaseRationalCurveGraph {
    initialize() {
        //this.createRationalJSXBezierCurve([[-3, 2], [0, -2], [1, 2], [3, -2]], [1, 5, 1, 1])
        let points = [[-3, 2], [-4, -1], [-3, -2], [-1, 1], [1, 2], [4, 2], [3, -1]].map(p => this.createJSXGraphPoint(p[0], p[1]))
        let spline = new BezierSpline(points, 3, 1)

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
        return <div></div>
    }
}

export default Graph;
