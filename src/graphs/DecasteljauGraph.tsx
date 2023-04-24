import React from 'react';
import '../App.css';
import {Button} from "../inputs/Button";
import {BaseCurveGraph} from "./BaseCurveGraph";

class DecasteljauGraph extends BaseCurveGraph {
    private slider: JXG.Slider | undefined;
    private segments: any;
    private lastDrawn: number | undefined;
    private decasteljauScheme: any;
    private timeout: NodeJS.Timeout | undefined;
    private pointColors = ["red", "green", "blue", "yellow"]

    constructor(props: any) {
        super(props);
        // set correct state

        this.setState({
            animating: false,
            jusMoving: true,
            deletingPoints: false
        });
    }

    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [3, -2]]
        this.createJSXBezierCurve(points)
        this.graphJXGPoints = this.jsxBezierCurves[0].getJxgPoints()
        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.1, 1]]);
        this.lastDrawn = Date.now();
        this.generateLineSegments(this.slider.Value())
        this.board.on("update", () => { // @ts-ignore
            if (Date.now() - this.lastDrawn > 60) {
                // @ts-ignore
                this.lastDrawn = Date.now()
                this.updateDecasteljauScheme(this.slider!.Value())
                this.jsxBezierCurves[0].setIntervalEnd(this.slider!.Value())
            }
        })
    }


    updateDecasteljauScheme(t: number) {
        // done like this to avoid redrawing segments every tick
        const decasteljauScheme = this.getFirstCurve()!.decasteljauScheme(t)
        this.segments = []
        const n = decasteljauScheme.length
        for (let r = 0; r < n; r++) {
            for (let i = 0; i < n - r; i++) {
                const p1 = decasteljauScheme[r][i]
                this.decasteljauScheme[r][i].setX(p1.X())
                this.decasteljauScheme[r][i].setY(p1.Y())
            }
        }
    }

    generateLineSegments(t: number) {
        this.decasteljauScheme = this.getFirstCurve()?.decasteljauScheme(t)
        // so we can delete them later if we want to add extra points
        this.segments = []
        const n = this.decasteljauScheme.length
        for (let r = 0; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                const p1 = this.decasteljauScheme[r][i - 1]
                const p2 = this.decasteljauScheme[r][i]
                var pp1 = null;
                if (i === 1 && r !== 0) {
                    this.createJSXGraphPoint(() => p1.X(), () => p1.Y(), {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    })
                    pp1 = this.graphJXGPoints[this.graphJXGPoints.length - 1]
                } else {
                    if (r !== 0) {
                        pp1 = this.segments[this.segments.length - 1]
                    }
                }
                var pp2 = null;
                if (r === 0) {
                    pp1 = this.graphJXGPoints[i - 1]
                    pp2 = this.graphJXGPoints[i]
                } else {
                    this.createJSXGraphPoint(() => p2.X(), () => p2.Y(), {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    })
                    pp2 = this.graphJXGPoints[this.graphJXGPoints.length - 1]
                }
                const segment = this.board?.create('segment', [pp1, pp2]);
                this.segments.push(segment)
                this.segments.push(pp1)
                this.segments.push(pp2)
            }
        }
        const pointtt = this.decasteljauScheme[n - 1][0]
        this.board?.create('point', [() => pointtt.X(), () => pointtt.Y()], {
            // @ts-ignore
            style: JXG.POINT_STYLE_X,
            color: this.pointColors[n - 1],
            trace: false
        });
    }

    protected getAdditionalCommands(): JSX.Element {
        return this.state.animating ?
            <Button onClick={() => this.stopAnimation()} text="Ustavi"/> :
            <Button onClick={() => this.startAnimation()} text="Animiraj"/>;
    }

    private startAnimation() {
        // @ts-ignore
        this.slider?.startAnimation(1, 150, 30)
        this.segmentAnimation()
        this.setState({animating: true})
    }

    private segmentAnimation() {
        this.updateDecasteljauScheme(this.slider?.Value() as number)
        this.timeout = setTimeout(() => this.segmentAnimation(), 30)
    }

    private stopAnimation() {
        clearTimeout(this.timeout)
        this.slider?.stopAnimation()
        this.setState({animating: false})
    }
}

export default DecasteljauGraph;
