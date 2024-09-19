import {AbstractJXGSplineCurve, JSXSplineConstructorParams} from "./AbstractJXGSplineCurve";
import {Board} from "jsxgraph";
import {G1QuadraticBezierSpline} from "../../../bezeg/impl/curve/G1QuadraticBezierSpline";
import {PointStyles} from "../../styles/PointStyles";


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
        return curve;
    }

    override addPoint(x: number, y: number) {
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length, () => this.isShowingJxgPoints()));
        this.pointControlledCurve.addPoint(p);
        this.pointControlledCurve.generateBezierCurves();
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const len = this.nonFreeJsxPoints.length;
            const jsxpoint = this.createFixedJsxPoint(this.getCurve().getNonFreePoints()[len]);
            this.nonFreeJsxPoints.push(jsxpoint.point);
        }
        this.labelJxgPoints();
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