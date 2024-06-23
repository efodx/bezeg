import {JGBox} from "../../JGBox";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Commands} from "../base/Commands";
import {Board, JSXGraph} from "jsxgraph";
import {BezierCurveImpl} from "../../bezeg/bezier-curve-impl";
import {PointImpl} from "../../bezeg/point/point-impl";
import {range} from "../../utils/Range";
import {Colors} from "../bezier/utilities/Colors";
import {Tools} from "../base/Tools";
import {ResetButton} from "../base/RefreshContext";

function generateBernsteinPolynomials(board: JXG.Board, jxgObjects: JXG.GeometryElement[], n: number) {
    board.removeObject(jxgObjects)
    jxgObjects.length = 0
    const numOfPolynoms = n

    range(0, numOfPolynoms - 1, 1).forEach(i => {
        const points = Array(numOfPolynoms - 1).fill([0, 0])
        points.splice(i, 0, [1, 0])
        const anchor = [0.475, 0.97 - 0.05 * i]
        const bezierCurve = new BezierCurveImpl(points.map(point => new PointImpl(point[0], point[1])))
        let curve = board.create("functiongraph", [(t: number) => bezierCurve.calculatePointAtT(t).X(), 0, 1], {
            strokeWidth: 4,
            strokeColor: Colors[i]
        })
        jxgObjects.push(curve)
        let segment = board.create('segment', [[anchor[0], anchor[1]], [anchor[0] + 0.1, anchor[1]]], {
            useMathJax: true,
            parse: false,
            color: Colors[i],
            fixed: true
        }) as JXG.GeometryElement
        let label = board.create('text', [anchor[0] - 0.06, anchor[1], () => "$$B^{" + (n - 1) + "}_{" + i + "}(t)$$"], {
            cssClass: "smart-label-point2",
            highlightCssClass: "smart-label-point2",
            useMathJax: true,
            parse: false,
            color: Colors[i],
            autoPosition: true,
            fixed: true
        }) as JXG.GeometryElement
    })

}

export function BernsteinGraph() {
    const padding = 0.1
    const board: MutableRefObject<Board | undefined> = useRef()
    const jxgObjects: MutableRefObject<JXG.GeometryElement[]> = useRef([])
    const [n, setN] = useState(3)

    useEffect(() => {
        board.current = JSXGraph.initBoard("jgbox", {
            showFullscreen: true,
            boundingbox: [-padding, 1 + padding, 1 + padding, -padding],
            axis: true,
            keepaspectratio: true,
            showScreenshot: true,
            showCopyright: false
        })
        generateBernsteinPolynomials(board.current, jxgObjects.current, n)
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
                            <Button variant={"dark"} onClick={() => setN(Math.max(n - 1, 2))}
                                    className="btn-block">-</Button>
                        </ButtonGroup>
                    ]}
                    title={"Stopnja"}/>
            </Col>
        </Row>
    </Container>;
}