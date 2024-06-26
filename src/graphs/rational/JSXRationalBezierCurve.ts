/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {RationalBezierCurve} from "../../bezeg/rational-bezier-curve";
import {Board} from "jsxgraph";
import {AbstractJSXBezierCurve} from "../base/AbstractJSXBezierCurve";
import {PointStyles} from "../styles/PointStyles";
import {SizeContext} from "../../Contexts";

export class JSXRationalBezierCurve extends AbstractJSXBezierCurve<RationalBezierCurve> {
    private weightLabels: JXG.GeometryElement[] = [];
    private showingWeights: boolean = false;
    private sliders: JXG.Slider[] = [];
    private showingFarinPoints: boolean = false;

    constructor(points: number[][], weights: number[], board: Board) {
        super(points, board);
        this.pointControlledCurve.setWeights(weights)
    }

    addPoint(x: number, y: number) {
        super.addPoint(x, y)
        this.pointControlledCurve.getWeights().push(1)
        this.hideWeights()
        this.showWeights()
    }

    removePoint(i: number) {
        super.removePoint(i);
        this.pointControlledCurve.getWeights().splice(1, 1)
        this.hideWeights()
        this.showWeights()
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
        const wrappedPoints = elevated.getPoints().map((point, i) => this.createJSXGraphPoint(point.X(), point.Y(), PointStyles.pi(i)))
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
            this.board.create('smartlabel', [point, () => "$$w_{" + i + "}=" + this.getCurve().getWeights()[i].toFixed(2) + "$$"], {
                fontSize: () => SizeContext.fontSize,
                size: () => SizeContext.fontSize,
                cssClass: "smart-label-point2",
                highlightCssClass: "smart-label-point2",
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

    inStandardForm() {
        return this.getCurve().inStandardForm()
    }

    isShowingFarinPoints(): boolean {
        return this.showingFarinPoints
    }

    showFarinPoints(show: boolean) {
        if (show) {
            const weights = this.getCurve().getWeights()
            const points = this.getCurve().getPoints()

            const reactiveWeights: Array<() => number> = []
            reactiveWeights.push(() => 1)
            for (let i = 0; i < weights.length - 1; i++) {
                const startingRatio = weights[i + 1] / weights[i]
                const slider: JXG.Slider = this.board.create('slider', [[points[i].X(), points[i].Y()], [points[i + 1].X(), points[i + 1].Y()], [0, startingRatio / (1 + startingRatio), 1]],
                    {
                        size: () => SizeContext.pointSize,
                        baseline: {
                            strokeColor: '#0b9ef8',
                            strokeOpacity: 1,
                            strokeWidth: () => SizeContext.strokeWidth
                        },
                        highline: {
                            strokeColor: '#F8650B',
                            strokeOpacity: 1,
                            strokeWidth: () => SizeContext.strokeWidth
                        },
                        label: {fontSize: 0}
                    });
                this.sliders.push(slider)
                const ratio = () => slider.Value() / (1 - slider.Value())
                const weight = () => reactiveWeights[i]() * ratio()
                reactiveWeights.push(weight)
            }
            this.pointControlledCurve.setReactiveWeights(reactiveWeights)
        } else {
            this.board.removeObject(this.sliders)
            this.sliders = []
            this.pointControlledCurve.setWeights(this.pointControlledCurve.getWeights())
            this.pointControlledCurve.setReactiveWeights(undefined)
        }
        this.showingFarinPoints = show
    }

    protected getStartingCurve(points: number[][]): RationalBezierCurve {
        let jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i)))
        return new RationalBezierCurve(jsxPoints, jsxPoints.map(() => 1));
    }
}
