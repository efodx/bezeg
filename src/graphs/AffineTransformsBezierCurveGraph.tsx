import React from 'react';
import '../App.css';
import {BezierCurve} from "../bezeg/bezier-curve";
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import BaseGraph from "./BaseGraph";
import {Select} from "../inputs/Select";
import {Button} from "../inputs/Button";

class BezierCurveGraph extends BaseGraph {
    private bejzjer: BezierCurve | undefined;

    constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true};
    }

    initialize() {
        const p = this.createJSXGraphPoint(-3, 2);
        const p2 = this.createJSXGraphPoint(0, -2);
        const p3 = this.createJSXGraphPoint(1, 2);
        const p4 = this.createJSXGraphPoint(3, -2);
        this.bejzjer = new BezierCurve([p, p2, p3, p4])

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
                <Button onClick={() => this.scale(1.2)} text={"Povečaj"}></Button>
                <Button onClick={() => this.scale(0.8)} text={"Pomanjšaj"}></Button></div>
            <div><Button onClick={() => this.moveFor(-0.5, 0)} text={"Levo"}></Button>
                <Button onClick={() => this.moveFor(0.5, 0)} text={"Desno"}></Button></div>
            <div><Button onClick={() => this.moveFor(0, 0.5)} text={"Gor"}></Button>
                <Button onClick={() => this.moveFor(0, -0.5)} text={"Dol"}></Button></div>
            <div><Button onClick={() => this.rotate(0.10 * Math.PI)} text={"Rotiraj levo"}></Button>
                <Button onClick={() => this.rotate(-0.10 * Math.PI)} text={"Rotiraj desno"}></Button></div>
            <div><Button onClick={() => this.flip(true, false)} text={"Zrcali Y"}></Button>
                <Button onClick={() => this.flip(false, true)} text={"Zrcali X"}></Button></div>
        </div>;
    }

    moveFor(x: number, y: number) {
        this.bejzjer?.moveFor(x, y)
        this.board.update()
    }

    scale(scale: number) {
        this.bejzjer!.scale(scale)
        this.board.update()
    }

    handleDown(e: unknown) {
        if (this.state.justMoving) {
            return
        }
        let canCreate = true,

            i, coords: JXG.Coords, el;

        coords = this.getMouseCoords(e, i);

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

    private rotate(number: number) {
        this.bejzjer?.rotate(number)
        this.board.update()
    }

    private flip(b: boolean, b2: boolean) {
        this.bejzjer?.flip(b, b2)
        this.board.update()
    }
}

export default BezierCurveGraph;
