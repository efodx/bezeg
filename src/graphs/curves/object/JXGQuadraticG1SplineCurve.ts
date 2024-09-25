import {AbstractJXGSplineCurve, JSXSplineConstructorParams, SplineCurveState} from "./AbstractJXGSplineCurve";
import {Board} from "jsxgraph";
import {G1QuadraticBezierSpline} from "../../../bezeg/impl/curve/G1QuadraticBezierSpline";
import {PointStyles} from "../../styles/PointStyles";
import {CacheContext} from "../../context/CacheContext";

interface JXGQuadraticG1SplineCurveState extends SplineCurveState {
    b: number[];
}

export class JXGQuadraticG1SplineCurve extends AbstractJXGSplineCurve<G1QuadraticBezierSpline> {
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
        const state = params.state as JXGQuadraticG1SplineCurveState;
        if (state.b) {
            state.b.forEach((b, i) => curve.getCurve().setB(i, b));
            CacheContext.update();
            board.update();
        }
        return curve;
    }

    override exportState(): JXGQuadraticG1SplineCurveState {
        return {
            ...super.exportState(),
            b: this.getCurve().getBs()
        };
    }

    override labelJxgPoints() {
        if (this.labelAll) {
            const labels: string[] = [];
            const curves = this.getCurve().getUnderlyingCurves();
            console.log(curves.length);
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

    protected getInitialCurve(points: number[][]): G1QuadraticBezierSpline {
        const jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new G1QuadraticBezierSpline(jsxPoints);
    }
}