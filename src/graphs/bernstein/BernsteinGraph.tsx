import {JGBox} from "../../JGBox";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Commands} from "../base/Commands";
import {Board, JSXGraph} from "jsxgraph";
import {BezierCurveImpl} from "../../bezeg/bezier-curve-impl";
import {PointImpl} from "../../bezeg/point/point-impl";
import {Colors} from "../bezier/utilities/Colors";
import {Tools} from "../base/Tools";
import {ResetButton} from "../base/RefreshContext";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

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

function generateBernsteinPolynomials(board: JXG.Board, n: number, isSumGraph: boolean) {
    const numOfPolynoms = n
    const polynoms: Array<(t: number) => number> = []
    // board.create("curve", [(t: number) => t, (t: number) => 0, 0, 1], {
    //     strokeWidth: 4
    // })
    // board.create("curve", [(t: number) => 0, (t: number) => t, 0, 1], {
    //     strokeWidth: 4
    // })
    let curves: Array<JXG.Curve> = []

    for (let i = 0; i < numOfPolynoms; i++) {
        const points = Array(numOfPolynoms - 1).fill([0, 0])
        points.splice(i, 0, [1, 0])
        const anchor = [0.475, 0.97 - 0.05 * i]
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
            board.create("curve", [(t: number) => t, (t: number) => polynoms[i](t), 0, 1], {
                strokeWidth: 4,
                strokeColor: Colors[i]
            })
            board.create('segment', [[anchor[0], anchor[1]], [anchor[0] + 0.1, anchor[1]]], {
                useMathJax: true,
                parse: false,
                color: Colors[i],
                fixed: true
            })
            board.create('text', [anchor[0] - 0.06, anchor[1], () => "$$B^{" + (n - 1) + "}_{" + i + "}(t)$$"], {
                cssClass: "smart-label-point2",
                highlightCssClass: "smart-label-point2",
                useMathJax: true,
                parse: false,
                color: Colors[i],
                autoPosition: true,
                fixed: true
            })
        }


    }

}

export function BernsteinGraph() {
    const padding = 0.1
    const board: MutableRefObject<Board | undefined> = useRef()
    const [n, setN] = useState(3)
    const [isSumGraph, setIsSumGraph] = useState(false)

    useEffect(() => {
        board.current = JSXGraph.initBoard("jgbox", {
            showFullscreen: true,
            boundingbox: [-padding, 1 + padding, 1 + padding, -padding],
            axis: true,
            keepaspectratio: true,
            showScreenshot: true,
            showCopyright: false
        })
        generateBernsteinPolynomials(board.current, n, isSumGraph)
    })

    return <Container fluid>
        <Row className={"align-items-center"} style={{height: "92vh"}}>
            <Col xs={2}><Tools tools={[<ResetButton/>]}/> </Col>
            <Col xs={8}><JGBox/></Col>
            <Col xs={2}>
                <Commands
                    commands={[
                        <ButtonGroup>
                            <Button variant={"dark"} className="btn-block"
                                    onClick={() => setN(Math.min(n + 1, 11))}>+</Button>
                            <Button onClick={() => 1}
                                    className="btn-block">{n - 1}</Button>
                            <Button variant={"dark"} onClick={() => setN(Math.max(n - 1, 1))}
                                    className="btn-block">-</Button>
                        </ButtonGroup>,
                        <OnOffSwitch initialState={isSumGraph} onChange={checked => setIsSumGraph(checked)}
                                     label={"Sum graph"}/>
                    ]}
                    title={"Stopnja"}/>
            </Col>
        </Row>
    </Container>;
}