import React from 'react';
import '../App.css';
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import BaseGraph from "./BaseGraph";
import {Button} from "../inputs/Button";
import {RationalBezierCurve} from "../bezeg/rational-bezier-curve";

class Graph extends BaseGraph {
    private bejzjer: RationalBezierCurve | undefined;

    constructor(props: any) {
        super(props);
        this.state = {deletingPoints: false, justMoving: true};
    }

    initialize() {
        const p = this.createJSXGraphPoint(-3, 2);
        const p2 = this.createJSXGraphPoint(0, -2);
        const p3 = this.createJSXGraphPoint(1, 2);
        const p4 = this.createJSXGraphPoint(3, -2);
        this.bejzjer = new RationalBezierCurve([p, p2, p3, p4], [1, 5, 1, 1])

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
            <Button onClick={() => this.elevate()} text={"Dvigni stopnjo"}/>
        </div>;
    }

    elevate() {
        const elevated = this.bejzjer!.elevate()
        this.board?.removeObject(this.points)
        this.points = []
        const wrappedPoints = elevated.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.bejzjer?.setPoints(wrappedPoints);
        this.bejzjer?.setWeights(elevated.getWeights())
        this.board.update()
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

export default Graph;
