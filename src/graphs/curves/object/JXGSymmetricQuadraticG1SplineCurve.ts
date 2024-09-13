import {AbstractJXGSplineCurve, JSXSplineConstructorParams} from "./AbstractJXGSplineCurve";
import {Board} from "jsxgraph";
import {G1SymmetricQuadraticBezierSpline} from "../../../bezeg/impl/curve/G1SymmetricQuadraticBezierSpline";
import {PointStyles} from "../../styles/PointStyles";


export class JXGSymmetricQuadraticG1SplineCurve extends AbstractJXGSplineCurve<G1SymmetricQuadraticBezierSpline> {
    static toDto(curve: JXGSymmetricQuadraticG1SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JXGSymmetricQuadraticG1SplineCurve {
        const curve = new JXGSymmetricQuadraticG1SplineCurve(params.points, board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve;
    }

    protected getInitialCurve(points: number[][]): G1SymmetricQuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new G1SymmetricQuadraticBezierSpline(jsxPoints);
    }
}