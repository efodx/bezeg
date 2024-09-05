import {JSXSplineConstructorParams, JXGSplineCurve} from "./JXGSplineCurve";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";
import {C1QuadraticBezierSpline} from "../../bezeg/impl/curve/C1QuadraticBezierSpline";


export class JXGQuadraticC1SplineCurve extends JXGSplineCurve<C1QuadraticBezierSpline> {
    static toDto(curve: JXGQuadraticC1SplineCurve): JSXSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXSplineConstructorParams, board: Board): JXGQuadraticC1SplineCurve {
        const curve = new JXGQuadraticC1SplineCurve(params.points, board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve;
    }


    override getJxgPoints() {
        // We order them so that labeling of points gets done correctly!
        const freePoints: JXG.Point[] = this.getAllFreeJxgPoints();
        const nonFreePoints: JXG.Point[] = this.getAllNonFreeJxgPoints();
        return this.getCurve().getAllCurvePoints().map(point => point.isXFunction() || point.isYFunction())
            .map(fixed => {
                if (fixed) {
                    return nonFreePoints.shift()!;
                } else {
                    return freePoints.shift()!;
                }
            });
    }

    protected getStartingCurve(points: number[][]): C1QuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new C1QuadraticBezierSpline(jsxPoints);
    }
}