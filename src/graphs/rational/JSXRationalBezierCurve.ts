/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {RationalBezierCurve} from "../../bezeg/rational-bezier-curve";
import {Board} from "jsxgraph";
import {AbstractJSXBezierCurve} from "../base/AbstractJSXBezierCurve";
import {Labels} from "../../utils/PointLabels";

export class JSXRationalBezierCurve extends AbstractJSXBezierCurve<RationalBezierCurve> {
    private weightLabels: JXG.GeometryElement[] = [];
    private showingWeights: boolean = false;

    constructor(points: number[][], weights: number[], board: Board) {
        super(points, board);
        this.pointControlledCurve.setWeights(weights)
    }

    addPoint(x: number, y: number) {
        super.addPoint(x, y)
        this.pointControlledCurve.getWeights().push(1)
    }

    subdivide(t: number): this {
        const [curve1, curve2]: RationalBezierCurve[] = this.pointControlledCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())
        this.pointControlledCurve.setWeights(curve1.getWeights())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        return new JSXRationalBezierCurve(curve2pointArray, curve2.getWeights(), this.board) as this
    }

    elevate() {
        const elevated = this.pointControlledCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map((point, i) => this.createJSXGraphPoint(point.X(), point.Y(), Labels.pi(i)))
        this.pointControlledCurve.setWeights(elevated.getWeights())
        this.pointControlledCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: RationalBezierCurve = this.pointControlledCurve.extrapolate(t)
        this.pointControlledCurve.setWeights(extrapolatedBezier.getWeights())
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    showWeights() {
        if (this.weightLabels.length !== 0) {
            this.hideWeights()
        }
        // @ts-ignore
        this.weightLabels = this.getJxgPoints().map((point, i) =>
            // @ts-ignore
            this.board.create('smartlabel', [point, () => "$$w_" + i + "=" + this.getCurve().getWeights()[i].toFixed(2) + "$$"], {
                cssClass: "smart-label-point2",
                useMathJax: true,
                parse: false,
                autoPosition: true
            }));
        this.showingWeights = true
    }

    hideWeights() {
        this.board.removeObject(this.weightLabels)
        this.weightLabels = []
        this.showingWeights = false
    }

    isShowingWeights(): boolean {
        return this.showingWeights
    }

    protected getStartingCurve(points: number[][]): RationalBezierCurve {
        let jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], Labels.pi(i)))
        return new RationalBezierCurve(jsxPoints, jsxPoints.map(() => 1));
    }
}
