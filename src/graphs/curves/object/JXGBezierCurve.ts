import {AbstractJXGBezierCurve, BezierCurveAttributes} from "./AbstractJXGBezierCurve";
import {BezierCurveCommands} from "./inputs/BezierCurveCommands";
import {Board} from "jsxgraph";
import {PointControlledCurveState} from "./AbstractJXGPointControlledCurve";
import {BezierCurve} from "../../../bezeg/api/curve/bezier-curve";
import {PolynomialBezierCurve} from "../../../bezeg/impl/curve/polynomial-bezier-curve";
import {PointStyles} from "../../styles/PointStyles";

export interface JSXBezierCurveConstructorParams {
    points: number[][],
    state: JXGBezierCurveState
}

export interface JXGBezierCurveState extends PointControlledCurveState {
    subdivisionT: number
    decasteljauT: number
    extrapolationT: number
    showingDecasteljauScheme: boolean
}

/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
export class JXGBezierCurve extends AbstractJXGBezierCurve<BezierCurve, BezierCurveAttributes> {

    static toDto(curve: JXGBezierCurve): JSXBezierCurveConstructorParams {
        return {
            points: curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        };
    }

    static fromDto(params: JSXBezierCurveConstructorParams, board: Board): JXGBezierCurve {
        const curve = new JXGBezierCurve(params.points, board);
        if (params.state) {
            board.suspendUpdate();
            curve.importState(params.state);
            board.unsuspendUpdate();
        }
        return curve;
    }

    override importState(state: JXGBezierCurveState) {
        super.importState(state);
        this.setSubdivisionT(state.subdivisionT);
        this.setDecasteljauT(state.decasteljauT);
        this.setExtrapolationT(state.extrapolationT);
        // todo this is not nice, the showing of decasteljau scheme should be grouped
        if (!state.showingDecasteljauScheme) {
            this.hideDecasteljauScheme();
        } else {
            this.showCurrentDecasteljauScheme(state.showingDecasteljauScheme);
        }
    }


    override getDefaultAttributes(): BezierCurveAttributes {
        return {
            ...super.getDefaultAttributes(),
            allowSubdivision: true,
            allowShowControlPolygon: true,
            allowDecasteljau: true,
            allowElevation: true,
            allowExtrapolation: true,
            allowShowPoints: true,
            allowShrink: true
        };
    }

    override hideControlPolygon() {
        super.hideControlPolygon();
        if (this.isShowingDecasteljauScheme()) {
            this.showControlPolygonInternal();
        }
    }

    override getCurveCommands(): JSX.Element[] {
        return super.getCurveCommands().concat(...BezierCurveCommands(this));
    }


    subdivide(t?: number): this {
        if (t === undefined) {
            t = this.subdivisionT;
        }
        const [curve1, curve2]: BezierCurve[] = this.pointControlledCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints());

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()]);
        const newJsxCurve = new JXGBezierCurve(curve2pointArray, this.board) as this;
        newJsxCurve.setAttributes(this.getAttributes());
        if (this.subdivisionResultConsumer !== undefined) {
            this.subdivisionResultConsumer(newJsxCurve);
        }
        return newJsxCurve;
    }

    elevate() {
        const elevated = this.pointControlledCurve.elevate();
        this.clearJxgPoints();
        const wrappedPoints = elevated.getPoints().map((point, i) => this.createJSXGraphPoint(point.X(), point.Y(), PointStyles.pi(i, () => this.isShowingJxgPoints())));
        this.pointControlledCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: BezierCurve = this.pointControlledCurve.extrapolate(t);
        this.movePointsToNewPoints(extrapolatedBezier.getPoints());
    }

    getInitialCurve(points: number[][]): BezierCurve {
        let jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return new PolynomialBezierCurve(jsxPoints);
    }
}
