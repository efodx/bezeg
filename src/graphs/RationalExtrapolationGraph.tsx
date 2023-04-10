import React from 'react';
import '../App.css';
import {JGBox} from "../JGBox";
import {Button} from "../inputs/Button";
import BaseGraph from "./BaseGraph";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";

class GraphExtrapolation extends BaseGraph {
    private bejzjer: RationalBezierCurve | undefined;
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
        this.bejzjer = new RationalBezierCurve([p, p2, p3, p4], [1, 12, 1, 1])
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
        let [curve1, curve2]: RationalBezierCurve[] = this.bejzjer!.subdivide(this.slider!.Value());
        curve1 = this.bejzjer!.extrapolate(this.slider!.Value());
        this.board.removeObject(this.points)
        curve1.setPoints(curve1.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y())))

        this.bejzjer = curve1;
        this.board.update()
    }

}

export default GraphExtrapolation;
