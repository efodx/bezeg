import {AbstractJXGSplineCurve, JSXSplineConstructorParams} from "./AbstractJXGSplineCurve";
import {Board} from "jsxgraph";
import {GenericBezierSpline} from "../../../bezeg/impl/curve/GenericBezierSpline";
import {PointStyles} from "../../styles/PointStyles";

export interface JSXGenericSplineConstructorParams extends JSXSplineConstructorParams {
    continuity: number,
    degree: number
}

export class JXGGenericSplineCurve extends AbstractJXGSplineCurve<GenericBezierSpline> {

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

    static toDto(curve: JXGGenericSplineCurve): JSXGenericSplineConstructorParams {
        return {
            points: curve.pointControlledCurve.points.map(point => [point.X(), point.Y()]),
            degree: curve.pointControlledCurve.getDegree(),
            continuity: curve.pointControlledCurve.getContinuity(),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXGenericSplineConstructorParams, board: Board): JXGGenericSplineCurve {
        const curve = new JXGGenericSplineCurve(params.points, params.continuity, params.degree, board);
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

    override labelJxgPoints() {
        if (this.labelAll) {
            const labels: string[] = [];
            const curves = this.getCurve().getUnderlyingCurves();
            curves.forEach((curve, c) => {
                curve.getPoints().forEach((point, i) => {
                    if (i !== 0 || labels.length === 0) {
                        const name = "$$p_{\\scriptsize" + i + "}^{\\scriptsize(" + (c + 1) + ")}$$";
                        labels.push(name);
                    } else {
                        var name = " $$ p_{\\scriptsize" + (curves[c - 1].getPoints().length - 1) + "}^{\\scriptsize(" + c + ")}$$";
                        var name = " $$ p_{\\scriptsize" + (curves[c - 1].getPoints().length - 1) + "}^{\\scriptsize(" + c + ")}{\\scriptsize=}p_{\\scriptsize" + 0 + "}^{\\scriptsize(" + (c + 1) + ")}$$";
                        labels[labels.length - 1] = name;
                    }
                });
            });

            //    const name = PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string;
            this.getJxgPoints().forEach((point, i) => point.setName(labels[i]));
        } else {
            this.getJxgPoints().forEach((point, i) => point.setName(""));
            this.getAllFreeJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
        }
    }

    protected getInitialCurve(points: number[][]): GenericBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new GenericBezierSpline(jsxPoints, 3, 1);
    }
}