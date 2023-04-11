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
    private jxgCurve: JXG.Curve | undefined;
    private dragging: boolean = false;
    private coords: JXG.Coords | undefined;
    private curveSelected: boolean = false;
    private boundBoxSegments: (JXG.Segment | undefined)[] | undefined;
    private boundBoxPoints: JXG.Point[] | undefined;
    private resizing: boolean = false;
    private rotating: boolean = false;
    private resizingDir: number[] = [1, 1];

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

        this.jxgCurve = this.board.create('curve',
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
        this.board.on('up', (e) => this.handleUp(e));
        this.board.on('move', (e) => this.handleMove(e));
        this.addBoundingBox()

    }

    addBoundingBox() {
        const pointStyle = {name: "", color: "gray", opacity: 0.4}
        const p = this.board!.create('point', [() => this.bejzjer!.getBoundingBox()[0], () => this.bejzjer!.getBoundingBox()[2]], pointStyle);
        const p2 = this.board!.create('point', [() => this.bejzjer!.getBoundingBox()[0], () => this.bejzjer!.getBoundingBox()[3]], pointStyle);
        const p3 = this.board!.create('point', [() => this.bejzjer!.getBoundingBox()[1], () => this.bejzjer!.getBoundingBox()[3]], pointStyle);
        const p4 = this.board!.create('point', [() => this.bejzjer!.getBoundingBox()[1], () => this.bejzjer!.getBoundingBox()[2]], pointStyle);
        // @ts-ignore
        this.boundBoxPoints = [p, p2, p3, p4]


        const segmentStyle = {color: "gray", strokeWidth: 0.5, dash: 2, highlight: false}
        const segment = this.board!.create('segment', [p, p2], segmentStyle);
        const segment2 = this.board!.create('segment', [p2, p3], segmentStyle);
        const segment3 = this.board!.create('segment', [p3, p4], segmentStyle);
        const segment4 = this.board!.create('segment', [p4, p], segmentStyle);
        // @ts-ignore
        this.boundBoxSegments = [segment, segment2, segment3, segment4]
        this.hideBoundingBox()
    }

    showBoundingBox() {
        this.boundBoxSegments!.map(segment => segment!.show())
        this.boundBoxPoints!.map(point => point!.show())
    }

    hideBoundingBox() {
        this.boundBoxSegments!.map(segment => segment!.hide())
        this.boundBoxPoints!.map(point => point!.hide())
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

    isMouseInsideBoundingBox() {
        let [minX, maxX, minY, maxY] = this.bejzjer!.getBoundingBox()
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    isMouseInsidePaddedBoundingBox() {
        // this is so we can actually rotate and resize the curve
        let padding = 0.3
        let [minX, maxX, minY, maxY] = this.bejzjer!.getBoundingBox()
        minX = minX - padding
        maxX = maxX + padding
        minY = minY - padding
        maxY = maxY + padding
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    handleDown(e: unknown) {
        if (this.state.justMoving) {
            this.coords = this.getMouseCoords(e);
            // @ts-ignore
            if (this.jxgCurve?.hasPoint(this.coords.scrCoords[1], this.coords.scrCoords[2]) && !this.points.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2]))) {
                this.curveSelected = true
                this.showBoundingBox()
            } else {
                if (!this.isMouseInsidePaddedBoundingBox()) {
                    this.curveSelected = false
                    this.hideBoundingBox()
                }
                // @ts-ignore
                if (this.boundBoxPoints?.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) && this.curveSelected) {
                    this.resizing = true
                    // @ts-ignore
                    if (this.boundBoxPoints[0].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
                        this.resizingDir = [-1, -1]
                    }
                    // @ts-ignore
                    if (this.boundBoxPoints[1].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
                        this.resizingDir = [-1, 1]
                    }
                    // @ts-ignore
                    if (this.boundBoxPoints[2].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
                        this.resizingDir = [1, 1]
                    }
                    // @ts-ignore
                    if (this.boundBoxPoints[3].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
                        this.resizingDir = [1, -1]
                    }


                } else if (!this.isMouseInsideBoundingBox() && this.isMouseInsidePaddedBoundingBox() && this.curveSelected) {
                    this.hideBoundingBox()
                    this.rotating = true
                }
            }
            if (this.curveSelected && !this.resizing && !this.rotating) {
                this.dragging = true;
            }
            return
        }
        let canCreate = true,
            coords: JXG.Coords, el;

        coords = this.getMouseCoords(e);

        for (el of this.board.objectsList) {
            // @ts-ignore
            if (JXG.isPoint(el) && el.hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
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

    private handleUp(e: PointerEvent) {
        let [minX, maxX, minY, maxY] = this.bejzjer!.getBoundingBox()
        if (!this.state.justMoving) {
            // only handle when we're just moving shit
            return
        }
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.dragging = false;
            // @ts-ignore
            let [dx, dy] = [newCoords.usrCoords[1] - this.coords.usrCoords[1], newCoords.usrCoords[2] - this.coords.usrCoords[2]]
            this.bejzjer?.moveFor(dx, dy)
            return
        }
        if (this.resizing) {
            this.resizing = false;
            // @ts-ignore
            let [dx, dy] = [newCoords.usrCoords[1] - this.coords.usrCoords[1], newCoords.usrCoords[2] - this.coords.usrCoords[2]]
            dx = dx * this.resizingDir[0]
            dy = dy * this.resizingDir[1]
            let xScale = (dx + maxX - minX) / (maxX - minX)
            let yScale = (dy + maxY - minY) / (maxY - minY)
            this.bejzjer?.scale(xScale, yScale)
        }
        if (this.rotating) {
            this.rotating = false;
            let [xCenter, yCenter] = this.bejzjer!.getBoundingBoxCenter()
            let k1, k2
            k1 = (yCenter - this.coords!.usrCoords[2]) / (xCenter - this.coords!.usrCoords[1])
            k2 = (yCenter - newCoords.usrCoords[2]) / (xCenter - newCoords.usrCoords[1])

            let theta = Math.atan((k1 - k2) / (1 + k1 * k2))
            this.bejzjer?.rotate(theta)
            this.showBoundingBox()
        }
    }

    private handleMove(e: PointerEvent) {
        let [minX, maxX, minY, maxY] = this.bejzjer!.getBoundingBox()
        if (!this.state.justMoving || !this.curveSelected) {
            // only handle when we're just moving shit
            return
        }
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            // @ts-ignore
            let [dx, dy] = [newCoords.usrCoords[1] - this.coords.usrCoords[1], newCoords.usrCoords[2] - this.coords.usrCoords[2]]
            this.bejzjer?.moveFor(dx, dy)
        }
        if (this.resizing) {
            // @ts-ignore
            let [dx, dy] = [newCoords.usrCoords[1] - this.coords.usrCoords[1], newCoords.usrCoords[2] - this.coords.usrCoords[2]]
            dx = dx * this.resizingDir[0]
            dy = dy * this.resizingDir[1]
            let xScale = (2 * dx + maxX - minX) / (maxX - minX)
            let yScale = (2 * dy + maxY - minY) / (maxY - minY)
            this.bejzjer?.scale(xScale, yScale)
        }
        if (this.rotating) {
            let [xCenter, yCenter] = this.bejzjer!.getBoundingBoxCenter()
            let k1, k2
            k1 = (yCenter - newCoords.usrCoords[2]) / (xCenter - newCoords.usrCoords[1])
            k2 = (yCenter - this.coords!.usrCoords[2]) / (xCenter - this.coords!.usrCoords[1])

            let theta = Math.atan((k1 - k2) / (1 + k1 * k2))

            console.log(theta)
            this.bejzjer?.rotate(theta)
        }
        this.coords = newCoords
        this.board.update()
    }
}

export default BezierCurveGraph;
