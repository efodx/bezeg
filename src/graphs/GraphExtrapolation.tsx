import React from 'react';
import '../App.css';

import {BezierCurve} from "../bezeg/bezier-curve";
import {JGBox} from "../JGBox";
import {Button} from "../inputs/Button";
import GraphBase from "./GraphBase";

class GraphExtrapolation extends GraphBase {
    private bejzjer: BezierCurve | undefined;
    private slider: JXG.Slider | undefined;

    constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false};
    }

    initialize() {
        const p = this.createJSXGraphPoint(-3, 2);
        const p2 = this.createJSXGraphPoint(0, -2);
        const p3 = this.createJSXGraphPoint(1, 2);
        const p4 = this.createJSXGraphPoint(2, -1);
        this.bejzjer = new BezierCurve([p, p2, p3, p4])
        this.slider = this.board.create('slider', [[2, 2], [4, 2], [1, 1.1, 1.2]]);
        this.board.create('curve',
            [(t: number) =>
                // @ts-ignore
                this.bejzjer.calculatePointAtT(t).X(),
                (t: number) =>
                    // @ts-ignore
                    this.bejzjer.calculatePointAtT(t).Y(),
                0, () => this.slider?.Value()]
        );
        console.log("points:" + this.bejzjer!.getPoints())
    }

    render() {
        return <div><JGBox/>
            <Button onClick={() => this.extrapolate()} text="Ekstrapoliraj"/>
        </div>;
    }


    private extrapolate() {
        const extrapolatedBezier = this.bejzjer!.extrapolate(this.slider!.Value())
        this.board?.removeObject(this.points)
        this.points = []
        const wrappedPoints = extrapolatedBezier.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.bejzjer?.setPoints(wrappedPoints);
        this.board.update()
    }

}

export default GraphExtrapolation;
