import {JSXSplineConstructorParams, JXGSplineCurve} from "./JXGSplineCurve";
import {Board} from "jsxgraph";
import {C2QubicBezierSpline} from "../../../bezeg/impl/curve/C2QubicBezierSpline";
import {PointStyles} from "../../styles/PointStyles";


export class JXGQubicC2SplineCurve extends JXGSplineCurve<C2QubicBezierSpline> {
    static toDto(curve: JXGQubicC2SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JXGQubicC2SplineCurve {
        const curve = new JXGQubicC2SplineCurve(params.points, board);
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