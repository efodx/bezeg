import {JSXSplineConstructorParams, JSXSplineCurve} from "./JSXSplineCurve";
import {Board} from "jsxgraph";
import {GenericBezierSpline} from "../../bezeg/impl/curve/GenericBezierSpline";
import {PointStyles} from "../styles/PointStyles";

export interface JSXGenericSplineConstructorParams extends JSXSplineConstructorParams {
    continuity: number,
    degree: number
}

export class JSXGenericSplineCurve extends JSXSplineCurve<GenericBezierSpline> {

    constructor(points: number[][], continuity: number, degree: number, board: Board) {
        super(points, board);
        this.board.suspendUpdate();
        this.pointControlledCurve.setContinuity(continuity);
        this.pointControlledCurve.setDegree(degree);
        this.pointControlledCurve.generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
        this.board.unsuspendUpdate();
    }

    static toDto(curve: JSXGenericSplineCurve): JSXGenericSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            degree: curve.pointControlledCurve.getDegree(),
            continuity: curve.pointControlledCurve.getContinuity(),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXGenericSplineConstructorParams, board: Board): JSXGenericSplineCurve {
        const curve = new JSXGenericSplineCurve(params.points, params.continuity, params.degree, board);
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

    increaseContinuity() {
        if (this.getCurve().getContinuity() + 1 === this.getCurve().getDegree()) {
            return;
        }
        this.getCurve().setContinuity(this.getCurve().getContinuity() + 1);
        this.getCurve().generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }

    decreaseContinuity() {
        if (this.getCurve().getContinuity() === 0) {
            return;
        }
        this.getCurve().setContinuity(this.getCurve().getContinuity() - 1);
        this.getCurve().generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }

    increaseDegree() {
        if (this.getCurve().getContinuity() === this.getCurve().getDegree() + 1) {
            return;
        }
        this.getCurve().setDegree(this.getCurve().getDegree() + 1);
        this.getCurve().generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }

    decreaseDegree() {
        if (this.getCurve().getContinuity() === this.getCurve().getDegree() - 1) {
            return;
        }
        this.getCurve().setDegree(this.getCurve().getDegree() - 1);
        this.getCurve().generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }


    protected getStartingCurve(points: number[][]): GenericBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new GenericBezierSpline(jsxPoints, 3, 1);
    }
}