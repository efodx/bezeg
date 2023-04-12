import {BezierCurve} from "../bezeg/bezier-curve";
import {Board} from "jsxgraph";

/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
export class JSXBezierCurve {
    private readonly bezierCurve: BezierCurve
    private readonly jxgCurve: JXG.Curve
    private readonly board: Board
    private jxgPoints: JXG.Point[]
    private boundBoxPoints: JXG.Point[] = []
    private boundBoxSegments: JXG.Segment[] = []
    private selected: boolean = false
    private dragging: boolean = false
    private rotating: boolean = false
    private resizing: boolean = false
    private coords: JXG.Coords | undefined;

    constructor(bezierCurve: BezierCurve, jxgCurve: JXG.Curve, jxgPoints: JXG.Point[], board: Board) {
        this.bezierCurve = bezierCurve
        this.jxgCurve = jxgCurve
        this.jxgPoints = jxgPoints
        this.board = board
        this.addBoundingBox()
        this.hideBoundingBox()
    }

    move(newCoords: JXG.Coords) {
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]]
        this.bezierCurve.moveFor(dx, dy)
    }

    resize(newCoords: JXG.Coords) {
        let [minX, maxX, minY, maxY] = this.bezierCurve.getBoundingBox()
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]]
        let [xDir, yDir] = this.getResizingDir()
        dx = dx * xDir
        dy = dy * yDir
        let xScale = (2 * dx + maxX - minX) / (maxX - minX)
        let yScale = (2 * dy + maxY - minY) / (maxY - minY)
        this.bezierCurve.scale(xScale, yScale)
    }

    rotate(newCoords: JXG.Coords) {
        let [xCenter, yCenter] = this.bezierCurve.getBoundingBoxCenter()
        let k1, k2
        k1 = (yCenter - newCoords.usrCoords[2]) / (xCenter - newCoords.usrCoords[1])
        k2 = (yCenter - this.coords!.usrCoords[2]) / (xCenter - this.coords!.usrCoords[1])
        let theta = Math.atan((k1 - k2) / (1 + k1 * k2))
        this.bezierCurve.rotate(theta)
    }

    processMouseUp(e: PointerEvent) {
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.stopDragging()
            this.move(newCoords)
            return
        }
        if (this.resizing) {
            this.stopResizing()
            this.resize(newCoords)
            return
        }
        if (this.rotating) {
            this.stopRotating()
            this.rotate(newCoords)
            return
        }
    }

    processMouseDown(e: PointerEvent) {
        this.coords = this.getMouseCoords(e);
        // @ts-ignore
        if (this.jxgCurve?.hasPoint(this.coords.scrCoords[1], this.coords.scrCoords[2]) && !this.jxgPoints.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2]))) {
            this.select()
            this.showBoundingBox()
        } else {
            if (!this.isMouseInsidePaddedBoundingBox()) {
                this.deselect()
                this.hideBoundingBox()
            }
            // @ts-ignore
            if (this.boundBoxPoints?.some(point => point.hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) && this.selected) {
                this.startResizing()
            } else if (!this.isMouseInsideBoundingBox() && this.isMouseInsidePaddedBoundingBox() && this.selected) {
                this.startRotating()
            }
        }
        if (this.selected && !this.resizing && !this.rotating) {
            this.startDragging()
        }
    }

    processMouseMove(e: PointerEvent) {
        const newCoords = this.getMouseCoords(e);
        if (this.dragging) {
            this.move(newCoords)
        }
        if (this.resizing) {
            this.resize(newCoords)
        }
        if (this.rotating) {
            this.rotate(newCoords)
        }
        this.board.update()
        this.coords = newCoords
    }

    getResizingDir(): number[] {
        // @ts-ignore
        if (this.boundBoxPoints[0].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, -1]
        }
        // @ts-ignore
        if (this.boundBoxPoints[1].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [-1, 1]
        }
        // @ts-ignore
        if (this.boundBoxPoints[2].hasPoint(this.coords!.scrCoords[1], this.coords!.scrCoords[2])) {
            return [1, 1]
        }
        return [1, -1]
    }

    startResizing() {
        this.resizing = true
    }

    stopResizing() {
        this.resizing = false
    }

    startDragging() {
        this.dragging = true
    }

    stopDragging() {
        this.dragging = false
    }

    startRotating() {
        this.rotating = true
        this.hideBoundingBox()
    }

    stopRotating() {
        this.rotating = false
        this.showBoundingBox()
    }

    select() {
        this.selected = true
    }

    deselect() {
        this.selected = false
    }

    isSelected() {
        return this.selected
    }

    getBezierCurve() {
        return this.bezierCurve
    }

    getJxgCurve() {
        return this.jxgCurve
    }

    showBoundingBox() {
        this.boundBoxSegments.map(segment => segment.show())
        this.boundBoxPoints.map(point => point.show())
    }

    hideBoundingBox() {
        this.boundBoxSegments.map(segment => segment.hide())
        this.boundBoxPoints.map(point => point.hide())
    }

    isMouseInsideBoundingBox() {
        let [minX, maxX, minY, maxY] = this.bezierCurve.getBoundingBox()
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    isMouseInsidePaddedBoundingBox() {
        // this is so we can actually rotate and resize the curve
        let padding = 0.3
        let [minX, maxX, minY, maxY] = this.bezierCurve.getBoundingBox()
        minX = minX - padding
        maxX = maxX + padding
        minY = minY - padding
        maxY = maxY + padding
        let x = this.coords!.usrCoords[1]
        let y = this.coords!.usrCoords[2]
        return (x < maxX && x > minX && y < maxY && y > minY)
    }

    hasPoint(x: number, y: number) {
        return this.jxgCurve.hasPoint(x, y)
    }

    private addBoundingBox() {
        const pointStyle = {name: "", color: "gray", opacity: 0.4}
        const p = this.board.create('point', [() => this.bezierCurve.getBoundingBox()[0], () => this.bezierCurve.getBoundingBox()[2]], pointStyle);
        const p2 = this.board.create('point', [() => this.bezierCurve.getBoundingBox()[0], () => this.bezierCurve.getBoundingBox()[3]], pointStyle);
        const p3 = this.board.create('point', [() => this.bezierCurve.getBoundingBox()[1], () => this.bezierCurve.getBoundingBox()[3]], pointStyle);
        const p4 = this.board.create('point', [() => this.bezierCurve.getBoundingBox()[1], () => this.bezierCurve.getBoundingBox()[2]], pointStyle);
        // @ts-ignore
        this.boundBoxPoints = [p, p2, p3, p4]


        const segmentStyle = {color: "gray", strokeWidth: 0.5, dash: 2, highlight: false}
        const segment = this.board.create('segment', [p, p2], segmentStyle);
        const segment2 = this.board.create('segment', [p2, p3], segmentStyle);
        const segment3 = this.board.create('segment', [p3, p4], segmentStyle);
        const segment4 = this.board.create('segment', [p4, p], segmentStyle);
        // @ts-ignore
        this.boundBoxSegments = [segment, segment2, segment3, segment4]
    }

    private getMouseCoords(e: PointerEvent) {
        const pos = this.board.getMousePosition(e);
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);
    }
}