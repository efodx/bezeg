import {JSXSplineConstructorParams, JXGSplineCurve} from "./JXGSplineCurve";
import {Board} from "jsxgraph";
import {G1QuadraticBezierSpline} from "../../../bezeg/impl/curve/G1QuadraticBezierSpline";
import {PointStyles} from "../../styles/PointStyles";


export class JXGQuadraticG1SplineCurve extends JXGSplineCurve<G1QuadraticBezierSpline> {
    static toDto(curve: JXGQuadraticG1SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JXGQuadraticG1SplineCurve {
        const curve = new JXGQuadraticG1SplineCurve(params.points, board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve;
    }

    protected getStartingCurve(points: number[][]): G1QuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new G1QuadraticBezierSpline(jsxPoints);
    }
}