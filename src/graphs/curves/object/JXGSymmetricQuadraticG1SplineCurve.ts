import {AbstractJXGSplineCurve, JSXSplineConstructorParams, SplineCurveState} from "./AbstractJXGSplineCurve";
import {Board} from "jsxgraph";
import {G1SymmetricQuadraticBezierSpline} from "../../../bezeg/impl/curve/G1SymmetricQuadraticBezierSpline";
import {PointStyles} from "../../styles/PointStyles";
import {CacheContext} from "../../context/CacheContext";

interface G1SymSplineState extends SplineCurveState {
    b: number[];
}

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
        const state = params.state as G1SymSplineState;
        if (state.b) {
            state.b.forEach((b, i) => curve.getCurve().setB(i, b));
            CacheContext.update();
            board.update();
        }
        return curve;
    }

    override exportState(): G1SymSplineState {
        return {
            ...super.exportState(),
            b: this.getCurve().getBs()
        };
    }

    override labelJxgPoints() {
        if (this.labelAll) {
            this.getJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
        } else {
            this.getJxgPoints().forEach((point, i) => point.setName(""));
            this.getAllFreeJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
        }
    }

    protected getInitialCurve(points: number[][]): G1SymmetricQuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new G1SymmetricQuadraticBezierSpline(jsxPoints);
    }
}