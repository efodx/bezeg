import React from 'react';
import '../App.css';
import {JGBox} from "../JGBox";
import {Button} from "../inputs/Button";
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";

class RationalBezierCurveGraph extends BaseRationalCurveGraph {
    private weightNumber: number = 1;

    constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true, currentWeight: 2};
    }

    initialize() {
        let points = [[-3, 2], [0, -2], [1, 2], [3, -2]]
        let weights = [1, 2, 1, 1]
        this.createRationalJSXBezierCurve(points, weights)
        this.jsxBezierCurves[0].getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow"
        })
    }

    getAdditionalCommands() {
        return <div>
            <div>
                <Button onClick={() => this.changeWeight(1.1)} text={"Dodaj težo"}/>
                <div style={{color: "white"}}>{this.state.currentWeight}</div>
                <Button onClick={() => this.changeWeight(0.9)} text={"Zmanjšaj težo"}/>
            </div>
            <div>
                <Button onClick={() => this.nextWeight()} text={"Naslednja Točka"}/>

            </div>
        </div>
    }


    render() {
        return <div><JGBox/>
            {this.getSelect()}
            {this.getAdditionalCommands()}
        </div>;
    }

    nextWeight() {
        this.jsxBezierCurves[0].getJxgPoints()[this.weightNumber].setAttribute({
            color: "red"
        })
        if (this.weightNumber === this.getFirstCurve()!.getWeights().length - 1) {
            this.weightNumber = 0;
        } else {
            this.weightNumber = this.weightNumber + 1;
        }

        this.jsxBezierCurves[0].getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow  "
        })
        this.refreshWeightState()
        this.board.update()
    }

    changeWeight(dw: number) {
        this.getFirstCurve()!.getWeights()[this.weightNumber] = Math.round(100 * this.getFirstCurve()!.getWeights()[this.weightNumber] * dw) / 100
        this.board.update()
        this.refreshWeightState()
    }

    refreshWeightState() {
        this.setState({currentWeight: this.getFirstCurve()!.getWeights()[this.weightNumber]})
    }

}

export default RationalBezierCurveGraph;
