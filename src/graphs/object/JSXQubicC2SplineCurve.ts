import {JSXSplineConstructorParams, JSXSplineCurve} from "./JSXSplineCurve";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";
import {C2QubicBezierSpline} from "../../bezeg/impl/curve/C2QubicBezierSpline";


export class JSXQubicC2SplineCurve extends JSXSplineCurve<C2QubicBezierSpline> {
    static toDto(curve: JSXQubicC2SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JSXQubicC2SplineCurve {
        const curve = new JSXQubicC2SplineCurve(params.points, board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve;
    }

    override getJxgPoints(): JXG.Point[] {
        return super.getAllFreeJxgPoints();
    }


    protected getStartingCurve(points: number[][]): C2QubicBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new C2QubicBezierSpline(jsxPoints);
    }
}