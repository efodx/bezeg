import {JSXSplineConstructorParams, JSXSplineCurve} from "./JSXSplineCurve";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";
import {G1SymmetricQuadraticBezierSpline} from "../../bezeg/impl/curve/G1SymmetricQuadraticBezierSpline";


export class JSXSymmetricQuadraticG1SplineCurve extends JSXSplineCurve<G1SymmetricQuadraticBezierSpline> {
    static toDto(curve: JSXSymmetricQuadraticG1SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JSXSymmetricQuadraticG1SplineCurve {
        const curve = new JSXSymmetricQuadraticG1SplineCurve(params.points, board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve;
    }

    protected getStartingCurve(points: number[][]): G1SymmetricQuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new G1SymmetricQuadraticBezierSpline(jsxPoints);
    }
}