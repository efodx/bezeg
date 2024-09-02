/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {AbstractJSXPointControlledCurve, PointControlledCurveState} from "./AbstractJSXPointControlledCurve";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";
import {Board} from "jsxgraph";
import {PointStyles} from "../styles/PointStyles";

export interface JSXSplineConstructorParams {
    points: number[][],
    state: SplineCurveState
}

export interface SplineCurveState extends PointControlledCurveState {
    labelAll: boolean;
    hideFixed: boolean;
}

export abstract class JSXSplineCurve<C extends BezierSpline> extends AbstractJSXPointControlledCurve<C, any> {
    nonFreeJsxPoints!: JXG.Point[];
    labelAll: boolean = true;
    hideFixed: boolean = false;

    constructor(points: number[][], board: Board) {
        super(points, board);
        this.pointControlledCurve.generateBezierCurves();
        this.refreshNonFreeJsxGraphPoints();
        this.labelJxgPoints();
    }

    override addPoint(x: number, y: number) {
        let p = this.createJSXGraphPoint(x, y, PointStyles.pi(this.pointControlledCurve.getPoints().length, () => this.isShowingJxgPoints()));
        this.pointControlledCurve.addPoint(p);
        this.pointControlledCurve.generateBezierCurves();
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const len = this.nonFreeJsxPoints.length;
            const jsxpoint = this.createFixedJsxPoint(this.getCurve(), len);
            this.nonFreeJsxPoints.push(jsxpoint.point);
        }
        this.labelJxgPoints();
    }

    override removePoint(i: number) {
        const pointToRemove = this.getJxgPoints()[i];
        this.board.removeObject(pointToRemove);
        this.pointControlledCurve.removePoint(this.pointControlledCurve.getPoints().filter(p => pointToRemove.X() == p.X() && pointToRemove.Y() == p.Y())[0]);
        this.jxgPoints = this.jxgPoints.filter(point => point !== pointToRemove);
        this.pointControlledCurve.generateBezierCurves();
        while (this.pointControlledCurve.getNonFreePoints().length !== this.nonFreeJsxPoints.length) {
            const removed = this.nonFreeJsxPoints.pop();
            this.jxgPoints = this.jxgPoints.filter(el => el !== removed);
            this.board.removeObject(removed!);
        }
        this.labelJxgPoints();
    }

    getAllFreeJxgPoints() {
        return super.getJxgPoints().filter(point => !this.nonFreeJsxPoints.includes(point));
    }

    getAllNonFreeJxgPoints() {
        return super.getJxgPoints().filter(point => this.nonFreeJsxPoints.includes(point));
    }

    override labelJxgPoints() {
        if (this.labelAll) {
            this.getJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
        } else {
            this.getJxgPoints().forEach((point, i) => point.setName(""));
            this.getAllFreeJxgPoints().forEach((point, i) => point.setName(PointStyles.pi(i, () => this.isShowingJxgPoints()).name as string));
        }

    }

    setLabelAll(all: boolean) {
        this.labelAll = all;
        this.labelJxgPoints();
    }

    getLabelAll() {
        return this.labelAll;
    }

    override importState(state: SplineCurveState) {
        super.importState(state);
        if (state.labelAll !== undefined) {
            this.setLabelAll(state.labelAll);
        }
        if (state.hideFixed !== undefined) {
            this.setHideFixed(state.hideFixed);
        }
    }

    override exportState() {
        return {
            ...super.exportState(),
            labelAll: this.labelAll,
            hideFixed: this.hideFixed
        } as SplineCurveState;
    }

    getHideFixed() {
        return this.hideFixed;
    }

    setHideFixed(hideFixed: boolean) {
        this.hideFixed = hideFixed;
        this.board.update();
    }

    protected refreshNonFreeJsxGraphPoints() {
        this.board.removeObject(this.nonFreeJsxPoints);
        const spline = this.getCurve();
        // This may look dumb, but in reality this makes us able to change underlying non-free points
        this.nonFreeJsxPoints = spline.getNonFreePoints()
            .map((p, i) => this.createFixedJsxPoint(spline, i))
            //  .map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.fixed))
            .map(point => point.point);
    }

    private createFixedJsxPoint(spline: C, i: number) {
        return this.createJSXGraphPoint(() => spline.getNonFreePoints()[i].X(), () => spline.getNonFreePoints()[i].Y(), {
            ...PointStyles.fixed,
            visible: () => !this.hideFixed
        });
    }
}
