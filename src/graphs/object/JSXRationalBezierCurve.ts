/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {RationalBezierCurve} from "../../bezeg/impl/curve/rational-bezier-curve";
import {Board} from "jsxgraph";
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";
import {PointStyles} from "../styles/PointStyles";
import {SizeContext} from "../context/SizeContext";
import {RationalBezierCurveCommands} from "./inputs/RationalBezierCurveCommands";

export class JSXRationalBezierCurve extends AbstractJSXBezierCurve<RationalBezierCurve, any> {
    subdivisionT: number = 0.5;
    extrapolationT: number = 1.2;
    subdivisionPoint: JXG.Point | null = null;
    extrapolationPoint: JXG.Point | null = null;
    weightNumber: number = 1;
    private weightLabels: JXG.GeometryElement[] = [];
    private showingWeights: boolean = false;
    private sliders: JXG.Slider[] = [];
    private showingFarinPoints: boolean = false;

    constructor(points: number[][], weights: number[], board: Board) {
        super(points, board);
        this.pointControlledCurve.setWeights(weights)
    }

    override addPoint(x: number, y: number) {
        super.addPoint(x, y)
        this.pointControlledCurve.getWeights().push(1)
        this.hideWeights()
        this.showWeights()
    }

    override removePoint(i: number) {
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
        const newJsxCurve = new JSXRationalBezierCurve(curve2pointArray, curve2.getWeights(), this.board) as this
        if (this.subdivisionResultConsumer !== undefined) {
            this.subdivisionResultConsumer(newJsxCurve)
        }
        return newJsxCurve
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

    showwWeights(show: boolean) {
        if (show) {
            this.showWeights()
        } else {
            this.hideWeights()
        }

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

    override getCurveCommands(): JSX.Element[] {
        return super.getCurveCommands().concat(...RationalBezierCurveCommands(this));
    }

    setSubdivisionT(t: number) {
        this.subdivisionT = t
        this.board.update()
    }

    setExtrapolationT(t: number) {
        this.extrapolationT = t
        this.board.update()
    }

    createSubdivisionPoint() {
        if (this.board && !this.subdivisionPoint && this) {
            this.subdivisionPoint = this.board.create('point', [() => this.getCurve().calculatePointAtT(this.subdivisionT).X(),
                () => this.getCurve().calculatePointAtT(this.subdivisionT).Y()]);
            this.subdivisionPoint.hide()
        }
    }

    createExtrapolationPoint() {
        if (this.board && !this.extrapolationPoint && this) {
            this.extrapolationPoint = this.board.create('point', [() => this.getCurve().calculatePointAtT(this.extrapolationT).X(),
                () => this.getCurve().calculatePointAtT(this.extrapolationT).Y()]);
            this.extrapolationPoint.hide()
        }
    }

    showSubdivisionPoint() {
        this.subdivisionPoint?.show()
    }

    hideSubdivisionPoint() {
        this.subdivisionPoint?.hide()
    }

    showExtrapolationPoint() {
        this.setIntervalEnd(() => this.extrapolationT)
        this.extrapolationPoint?.show()
    }

    hideExtrapolationPoint() {
        this.setIntervalEnd(1)
        this.extrapolationPoint?.hide()
    }

    extrapolateSelectedCurve() {
        this.board.suspendUpdate()
        this.extrapolate(this.extrapolationT)
        this.board.unsuspendUpdate()
    }

    subdivideSelectedCurve() {
        this.board.suspendUpdate()
        let newCurve = this.subdivide(this.subdivisionT)
        // this.jsxBezierCurves.push(newCurve);
        // this.deselectSelectedCurve()
        this.board.unsuspendUpdate()
        return newCurve
    }

    elevateSelectedCurve() {
        this.board.suspendUpdate()
        this.elevate()
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
        this.board.unsuspendUpdate()
    }

    setStandardForm(standard: boolean) {
        this.pointControlledCurve.setStandardForm(standard)
        this.board.update()
    }

    override select() {
        super.select()
        this.getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow"
        })
    }

    override deselect() {
        if (this.subdivisionPoint) {
            // @ts-ignore
            this.board.removeObject(this.subdivisionPoint)
        }
        if (this.extrapolationPoint) {
            this.board.removeObject(this.extrapolationPoint)
        }
        this.getJxgPoints()[this.weightNumber].setAttribute({
            color: "#D55E00"
        })
        super.deselect();

        this.subdivisionPoint = null
        this.extrapolationPoint = null
    }

    nextWeight() {
        this.setSelectedWeight(this.weightNumber + 1)
    }

    prevWeight() {
        this.setSelectedWeight(this.weightNumber - 1)
    }

    setSelectedWeight(i: number) {
        this.getJxgPoints()[this.weightNumber].setAttribute({
            color: "#D55E00"
        })
        if (i > this.getCurve().getWeights().length - 1) {
            this.weightNumber = 0;
        } else if (i < 0) {
            this.weightNumber = this.getCurve().getWeights().length - 1;
        } else {
            this.weightNumber = i;
        }
        this.getJxgPoints()[this.weightNumber].setAttribute({
            color: "yellow  "
        })
        this.board.update()
    }


    changeWeight(dw: number) {
        this.setWeight(this.getCurve().getWeights()[this.weightNumber] + dw)
    }

    setWeight(w: number) {
        let newWeights = this.getCurve().getWeights().map(i => i)
        newWeights[this.weightNumber] = w
        this.getCurve().setWeights(newWeights)
        this.board.update()
    }

    getWeightNumber() {
        return this.weightNumber
    }

    getCurrentWeight() {
        return this.getCurve().getWeights()[this.getWeightNumber()]
    }

    resetWeight() {
        this.setWeight(1)
    }

    protected getStartingCurve(points: number[][]): RationalBezierCurve {
        let jsxPoints = points.map((point, i) => this.createJSXGraphPoint(point[0], point[1], PointStyles.pi(i)))
        return new RationalBezierCurve(jsxPoints, jsxPoints.map(() => 1));
    }

}
