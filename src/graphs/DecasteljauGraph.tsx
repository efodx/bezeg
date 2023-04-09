import React from 'react';
import '../App.css';
import {BezierCurve} from "../bezeg/bezier-curve";
import {Point} from "./Point";
import {JGBox} from "../JGBox";
import {Button} from "../inputs/Button";
import BaseGraph from "./BaseGraph";

class DecasteljauGraph extends BaseGraph {
    private bejzjer: BezierCurve | undefined;
    private slider: JXG.Slider | undefined;
    private segments: any;
    private lastDrawn: number | undefined;
    private decasteljauScheme: any;
    private timeout: NodeJS.Timeout | undefined;
    private pointColors = ["red", "green", "blue", "yellow"]

    constructor(props: any) {
        super(props);
        this.state = {animating: false};
    }

    initialize() {
        const p = this.board.create('point', [-4, -3]);
        const pp = new Point(p);
        const p2 = this.board.create('point', [-3, 2]);
        const pp2 = new Point(p2);
        const p3 = this.board.create('point', [2, 2]);
        const pp3 = new Point(p3);
        const p4 = this.board.create('point', [3, -2]);
        const pp4 = new Point(p4);
        this.points = [p, p2, p3, p4]
        this.bejzjer = new BezierCurve([pp, pp2, pp3, pp4])

        this.slider = this.board.create('slider', [[2, 3], [4, 3], [0, 0.1, 1]]);
        this.lastDrawn = Date.now();
        this.generateLineSegments(this.slider.Value())
        this.board.on("update", () => { // @ts-ignore
            if (Date.now() - this.lastDrawn > 60) {
                // @ts-ignore
                this.lastDrawn = Date.now()
                this.updateDecasteljauScheme(this.slider?.Value() as number)
            }
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
                0, () => this.slider?.Value()]
        );
    }

    render() {
        return <div><JGBox/>
            {this.state.animating ?
                <Button onClick={() => this.stopAnimation()} text="Ustavi"/> :
                <Button onClick={() => this.startAnimation()} text="Animiraj"/>}
        </div>;
    }


    updateDecasteljauScheme(t: number) {
        // done like this to avoid redrawing segments every tick
        const decasteljauScheme = this.bejzjer!.decasteljau(t)
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
        // @ts-ignore
        this.decasteljauScheme = this.bejzjer.decasteljau(t)
        // so we can delete them later if we want to add extra points
        this.segments = []
        const n = this.decasteljauScheme.length
        for (let r = 0; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                const p1 = this.decasteljauScheme[r][i - 1]
                const p2 = this.decasteljauScheme[r][i]
                var pp1 = null;
                if (i === 1 && r !== 0) {
                    pp1 = this.board?.create('point', [() => p1.X(), () => p1.Y()], {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    });
                } else {
                    if (r !== 0) {
                        pp1 = this.segments[this.segments.length - 1]
                    }
                }
                var pp2 = null;
                if (r === 0) {
                    pp1 = this.points[i - 1]
                    pp2 = this.points[i]
                } else {
                    pp2 = this.board?.create('point', [() => p2.X(), () => p2.Y()], {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    });
                }
                // @ts-ignore
                //pp1?.hideElement()
                //pp2?.hideElement()
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
