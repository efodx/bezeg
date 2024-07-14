/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve, JSXBezierCurveConstructorParams} from "./JSXBezierCurve";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import {PointImpl} from "../../bezeg/impl/point/point-impl";
import {PointStyles} from "../styles/PointStyles";
import {Board} from "jsxgraph";
import {BezierCurveAttributes} from "./AbstractJSXBezierCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";
import {Attributes} from "../attributes/Attributes";


interface JSXPHBezierCurveConstructorParams extends JSXBezierCurveConstructorParams {
    hodographs: number[][]
}

export class JSXPHBezierCurve extends JSXBezierCurve {

    constructor(points: number[][], board: Board, attributes?: BezierCurveAttributes) {
        super(points, board, attributes);
        this.setAttributes({...Attributes.bezierDisabled, allowShowConvexHull: false})
    }

    static override toStr(curve: JSXPHBezierCurve): string {
        return JSON.stringify({
            points: [curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()])[0]],
            hodographs: (curve.getCurve() as PhBezierCurve).w.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        } as JSXPHBezierCurveConstructorParams)
    }

    static override fromStr(str: string, board: Board): JSXPHBezierCurve {
        const params = JSON.parse(str) as JSXPHBezierCurveConstructorParams
        const curve = new JSXPHBezierCurve(params.points.concat(params.hodographs), board)
        if (params.state) {
            curve.importState(params.state)
        }
        return curve
    }

    override getStartingCurve(points: number[][]): BezierCurve {
        const pointsImpl = points.map(p => new PointImpl(p[0], p[1]))
        const curve = new PhBezierCurve(pointsImpl.slice(0, 1), pointsImpl.slice(1));
        curve.getPoints().map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.pi(i)))
        return curve
    }
}
