import {JSXSplineConstructorParams, JSXSplineCurve} from "./JSXSplineCurve";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";
import {G1QuadraticBezierSpline} from "../../bezeg/impl/curve/G1QuadraticBezierSpline";


export class JSXQuadraticG1SplineCurve extends JSXSplineCurve<G1QuadraticBezierSpline> {
    static toDto(curve: JSXQuadraticG1SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JSXQuadraticG1SplineCurve {
        const curve = new JSXQuadraticG1SplineCurve(params.points, board);
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