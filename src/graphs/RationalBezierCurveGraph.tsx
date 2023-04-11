import React from 'react';
import '../App.css';
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import BaseGraph from "./BaseGraph";
import {Select} from "../inputs/Select";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";
import {Button} from "../inputs/Button";

class RationalBezierCurveGraph extends BaseGraph {
    private bejzjer: RationalBezierCurve | undefined;
    private weightNumber: number = 1;

    constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true, currentWeight: 2};
    }

    initialize() {
        const p = this.board.create('point', [-3, 2]);
        const pp = new Point(p);
        const p2 = this.board.create('point', [0, -2]);
        const pp2 = new Point(p2);
        const p3 = this.board.create('point', [1, 2]);
        const pp3 = new Point(p3);
        const p4 = this.board.create('point', [3, -2]);
        const pp4 = new Point(p4);
        this.points = [p, p2, p3, p4]
        this.bejzjer = new RationalBezierCurve([pp, pp2, pp3, pp4], [1, 2, 1, 1])
        this.points[this.weightNumber].setAttribute({
            color: "yellow"
        })
        this.board.create('curve',
            [(t: number) => {
                // @ts-ignore
                return this.bejzjer.calculatePointAtT(t).X();
            },
                (t: number) => {
                    // @ts-ignore
                    return this.bejzjer.calculatePointAtT(t).Y();
                },
                0, 1]
        );
        this.board.on('down', (e) => this.handleDown(e));

    }

    render() {
        return <div><JGBox/>
            <Select onChange={e => this.onSelectChange(e)}
                    options={[
                        {
                            "value": "1",
                            "text": "Premikaj točke"
                        },
                        {
                            "value": "2",
                            "text": "Dodajaj točke"
                        },
                        {
                            "value": "3",
                            "text": "Briši točke"
                        }
                    ]}/>
            <div>
                <Button onClick={() => this.changeWeight(1.1)} text={"Dodaj težo"}/>
                <div style={{color: "white"}}>{this.state.currentWeight}</div>
                <Button onClick={() => this.changeWeight(0.9)} text={"Zmanjšaj težo"}/>
            </div>
            <div>
                <Button onClick={() => this.nextWeight()} text={"Naslednja Točka"}/>

            </div>
        </div>;
    }

    nextWeight() {
        this.points[this.weightNumber].setAttribute({
            color: "red"
        })
        if (this.weightNumber === this.bejzjer!.getWeights().length - 1) {
            this.weightNumber = 0;
        } else {
            this.weightNumber = this.weightNumber + 1;
        }

        this.points[this.weightNumber].setAttribute({
            color: "yellow  "
        })
        this.refreshWeightState()
        this.board.update()
    }

    changeWeight(dw: number) {
        this.bejzjer!.getWeights()[this.weightNumber] = Math.round(100 * this.bejzjer!.getWeights()[this.weightNumber] * dw) / 100
        this.board.update()
        this.refreshWeightState()
    }

    refreshWeightState() {
        this.setState({currentWeight: this.bejzjer!.getWeights()[this.weightNumber]})
    }

    handleDown(e: unknown) {
        if (this.state.justMoving) {
            return
        }
        let canCreate = true,

            coords: JXG.Coords, el;

        coords = this.getMouseCoords(e);

        for (el in this.board.objects) {
            // @ts-ignore
            if (JXG.isPoint(this.board.objects[el]) && this.board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }

        if (canCreate && !this.state.deletingPoints) {
            let p = this.board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
            const pp = new Point(p);
            this.bejzjer?.addPoint(pp)
            this.points?.push(p)
        }
        if (!canCreate && this.state.deletingPoints) {
            let deleted = null;
            this.points?.forEach(
                (point, i) => {
                    // @ts-ignore
                    if (point.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                        deleted = i
                        this.board.removeObject(point)
                        this.bejzjer?.removePoint(this.bejzjer.getPoints()[i])
                    }
                }
            )
            if (deleted !== null) {
                this.points?.splice(deleted, 1)
            }
        }

    };

    private deletePoints() {
        this.setState(
            {
                deletingPoints: true,
                justMoving: false
            }
        )
    }

    private addPoints() {
        this.setState(
            {
                deletingPoints: false,
                justMoving: false
            }
        )
    }

    private justMove() {
        this.setState(
            {
                deletingPoints: false,
                justMoving: true
            }
        )
    }

    private onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let selectTool = e.target.value
        switch (selectTool) {
            case "1":
                this.justMove()
                return
            case "2":
                this.addPoints()
                return
            case "3":
                this.deletePoints()
                return
        }
    }
}

export default RationalBezierCurveGraph;
