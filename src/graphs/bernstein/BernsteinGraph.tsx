import {Button, ButtonGroup} from "react-bootstrap";
import React from "react";
import {BezierCurveImpl} from "../../bezeg/impl/curve/bezier-curve-impl";
import {PointImpl} from "../../bezeg/impl/point/point-impl";
import {Colors} from "../bezier/utilities/Colors";
import BaseGraph from "../base/BaseGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {SizeContext} from "../context/SizeContext";

function connectCurves(c1: [x1: (t: number) => number, y1: (t: number) => number], c2: [x2: (t: number) => number, y2: (t: number) => number]) {
    const x = (t: number) => {
        if (t < 1 / 2) {
            const c = t * 2
            return c1[0](c)
        } else {
            const c = t * 2 - 1
            return c2[0](c)
        }
    }
    const y = (t: number) => {
        if (t < 1 / 2) {
            const c = t * 2
            return c1[1](c)
        } else {
            const c = t * 2 - 1
            return c2[1](c)
        }
    }
    return [x, y]
}


export class BernsteinGraph extends BaseGraph<any, any> {
    override readonly state = {n: 2, isSumGraph: false};
    private jxgObjects: any = []
    private padding = 0.1

    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        this.generateBernsteinPolynomials(this.board, this.state.n, this.state.isSumGraph)
    }

    override presets() {
        return "bernstein-graph"
    }

    initialize(): void {
        this.generateBernsteinPolynomials(this.board, this.state.n, this.state.isSumGraph)
        this.board.setBoundingBox([-this.padding, 1 + this.padding * 2, 1 + this.padding, -this.padding], true)
        this.board.fullUpdate()
    }

    setN(number: number) {
        if (this.state.n === number) {
            return
        }
        this.setState({...this.state, n: number})
        this.generateBernsteinPolynomials(this.board, number, this.state.isSumGraph)
    }

    generateBernsteinPolynomials(board: JXG.Board, n: number, isSumGraph: boolean) {
        this.board.removeObject(this.jxgObjects)
        const numOfPolynoms = n
        const polynoms: Array<(t: number) => number> = []
        const jxgObjects = []
        const curves: Array<JXG.Curve> = []

        for (let i = 0; i < numOfPolynoms; i++) {
            const points = Array(numOfPolynoms - 1).fill([0, 0])
            points.splice(i, 0, [1, 0])
            const anchor = [(0.6 - numOfPolynoms * 0.10) + 0.20 * i, 1.05]
            const bezierCurve = new BezierCurveImpl(points.map(point => new PointImpl(point[0], point[1])))
            if (isSumGraph && i > 0) {
                polynoms.push((t: number) => polynoms[i - 1](t) + bezierCurve.calculatePointAtT(t).X())
                board.update()
            } else {
                polynoms.push((t: number) => bezierCurve.calculatePointAtT(t).X())
            }
            if (isSumGraph) {
                if (i === 0) {
                    let c1 = [(t: number) => t, (t: number) => polynoms[i](t), 0, 1]
                    let c2 = [(t: number) => 0, (t: number) => 1 - t, 0, 1]
                    let c3 = [(t: number) => t, (t: number) => 0, 0, 1]

                    // @ts-ignore
                    let c = connectCurves(connectCurves(c2, c3), c1)
                    if (n === 1) {
                        let c4 = [(t: number) => 1, (t: number) => 1 - t, 0, 1]
                        // @ts-ignore
                        c = connectCurves(c, c4)
                    }
                    let curve = board.create("curve", [(t: number) => c[0](t), (t: number) => c[1](t), 0, 1], {
                        strokeWidth: 0,
                        strokeColor: Colors[i],
                        fillColor: Colors[i]
                    })
                    curves.push(curve)
                } else if (i === numOfPolynoms - 1) {
                    let prevPolynom = polynoms[i - 1]
                    let c1 = [(t: number) => t, (t: number) => prevPolynom(t), 0, 1]
                    let c2 = [(t: number) => 1, (t: number) => t, 0, 1]
                    let c3 = [(t: number) => 1 - t, (t: number) => 1, 0, 1]

                    // @ts-ignore
                    let c = connectCurves(connectCurves(c2, c3), c1)
                    let curve = board.create("curve", [(t: number) => c[0](t), (t: number) => c[1](t), 0, 1], {
                        strokeWidth: 0,
                        strokeColor: Colors[i],
                        fillColor: Colors[i]
                    })
                    curves.push(curve)
                } else {
                    let prevPolynom = polynoms[i - 1]
                    let c1 = [(t: number) => t, (t: number) => prevPolynom(t)]
                    let c2 = [(t: number) => t, (t: number) => polynoms[i](t)]
                    // @ts-ignore
                    let c = connectCurves(c1, c2)
                    let curve = board.create("curve", [(t: number) => c[0](t), (t: number) => c[1](t), 0, 1], {
                        strokeWidth: 0,
                        strokeColor: Colors[i],
                        fillColor: Colors[i]
                    })
                    curves.push(curve)
                }

            } else {
                let curve = board.create("curve", [(t: number) => t, (t: number) => polynoms[i](t), 0, 1], {
                    strokeWidth: () => SizeContext.strokeWidth,
                    strokeColor: Colors[i]
                })
                jxgObjects.push(curve)
                // let segment = board.create('segment', [[anchor[0], anchor[1]], [anchor[0] + 0.1, anchor[1]]], {
                //     strokeWidth: () => Contexts.strokeWidth,
                //     useMathJax: true,
                //     parse: false,
                //     color: Colors[i],
                //     fixed: true
                // })
                // jxgObjects.push(segment)

            }
            let text = board.create('text', [anchor[0] - 0.06, anchor[1], () => "$$B^{" + (n - 1) + "}_{" + i + "}(t)$$"], {
                useMathJax: true,
                color: Colors[i],
                fontSize: () => SizeContext.fontSize - 5
            })
            jxgObjects.push(text)
            this.jxgObjects.push(...curves)
            this.jxgObjects.push(...jxgObjects)
        }

    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(<ButtonGroup>
                <Button className="btn-block"
                        onClick={() => this.setN(Math.min(this.state.n + 1, 6))}>+</Button>
                <Button variant="light" onClick={() => 1}
                        className="btn-block">{this.state.n - 1}</Button>
                <Button onClick={() => this.setN(Math.max(this.state.n - 1, 1))}
                        className="btn-block">-</Button>
            </ButtonGroup>,
            <OnOffSwitch initialState={this.state.isSumGraph} onChange={checked => this.setIsSumGraph(checked)}
                         label={"Naloženi ploščinski graf"}/>);
    }

    defaultPreset(): string {
        return "[]";
    }

    private setIsSumGraph(checked: boolean) {
        this.setState({...this.state, isSumGraph: checked})
        this.board.removeObject(this.jxgObjects)
        this.jxgObjects = []
        this.generateBernsteinPolynomials(this.board, this.state.n, checked)
    }
}