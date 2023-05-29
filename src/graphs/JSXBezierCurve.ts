import {BezierCurve} from "../bezeg/bezier-curve";
import {AbstractJSXBezierCurve} from "./AbstractJSXBezierCurve";
import {Point} from "../bezeg/point/point";

/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
export class JSXBezierCurve extends AbstractJSXBezierCurve<BezierCurve> {
    private decasteljauSegments: JXG.Segment[] = []
    private decasteljauPoints: JXG.Point[] = []
    private pointColors = ["red", "green", "blue", "yellow", "lightblue", "black", "azure", "beige", "blueviolet", "chocolate", "crimson", "floralwhite", "forstgreen"]
    private decasteljauScheme: Point[][] = [];
    private decasteljauSlider: JXG.Slider | null = null;
    private lastDecasteljauT: number | null = null;
    private showingDecasteljauScheme: boolean = false;

    private cachedDecasteljauScheme: Point[][] = [];
    private cacheHash: String = "";

    override hideControlPolygon() {
        super.hideControlPolygon();
        if (this.isShowingDecasteljauScheme()) {
            this.showControlPolygonInternal()
        }
    }

    isShowingDecasteljauScheme() {
        return this.showingDecasteljauScheme
    }


    hideDecasteljauScheme() {
        // @ts-ignore
        this.decasteljauPoints.concat(this.decasteljauSegments).forEach(el => el.hide())
        this.showingDecasteljauScheme = false;
        if (!this.isShowingControlPolygon()) {
            this.hideControlPolygon()
        }
    }

    showDecasteljauSchemeForSlider(slider: JXG.Slider) {
        this.decasteljauSlider = slider;
        if ((this.decasteljauSegments.length === 0 && this.getCurve().getPoints().length > 2) || this.decasteljauScheme.length !== this.getCurve().getPoints().length) {
            this.generateLineSegments(slider)
        } else {
            // @ts-ignore
            this.decasteljauSegments.concat(this.decasteljauPoints).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
    }

    showDecasteljauSchemeForT(t: number) {
        this.lastDecasteljauT = t
        if ((this.getCurve().getPoints().length > 2) || this.decasteljauScheme.length !== this.getCurve().getPoints().length) {
            this.generateLineSegmentsForT(t)
        } else {
            // @ts-ignore
            this.decasteljauSegments.concat(this.decasteljauPoints).forEach(el => el.show())
            this.showControlPolygonInternal()
        }
        this.showingDecasteljauScheme = true;
    }

    generateLineSegmentsForT(t: number) {
        this.decasteljauScheme = this.pointControlledCurve.decasteljauScheme(t)
        // @ts-ignore
        this.board.removeObject(this.decasteljauPoints.concat(this.decasteljauSegments))
        this.decasteljauSegments = []
        this.decasteljauPoints = []
        const n = this.decasteljauScheme.length
        this.showControlPolygonInternal()
        for (let r = 1; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                let pp1 = null;
                let pp2 = null;
                if (i === 1) {
                    // @ts-ignore
                    pp1 = this.board.create('point', [() => this.getDecasteljauScheme(t)[r][i - 1].X(),
                        () => this.getDecasteljauScheme(t)[r][i - 1].Y()], {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(t)[r][i].X(),
                    () => this.getDecasteljauScheme(t)[r][i].Y()], {
                    // @ts-ignore
                    style: JXG.POINT_STYLE_X,
                    color: this.pointColors[r]
                });
                const segment = this.board!.create('segment', [pp1, pp2]);
                this.decasteljauSegments.push(segment)
                // @ts-ignore
                this.decasteljauPoints.push(pp1)
                // @ts-ignore
                this.decasteljauPoints.push(pp2)
            }
        }
        let drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(t)[n - 1][0].X(), () => this.getDecasteljauScheme(t)[n - 1][0].Y()], {
            // @ts-ignore
            style: JXG.POINT_STYLE_X,
            color: this.pointColors[n - 1],
            trace: false
        });

        if (drawingPoint instanceof JXG.Point) {
            this.decasteljauPoints.push(drawingPoint)
        }

    }

    generateLineSegments(slider: JXG.Slider) {
        this.decasteljauScheme = this.pointControlledCurve.decasteljauScheme(slider.Value())
        // @ts-ignore
        this.board.removeObject(this.decasteljauPoints.concat(this.decasteljauSegments))
        this.decasteljauSegments = []
        this.decasteljauPoints = []
        const n = this.decasteljauScheme.length
        this.showControlPolygonInternal()
        for (let r = 1; r < n; r++) {
            for (let i = 1; i < n - r; i++) {
                let pp1 = null;
                let pp2 = null;
                if (i === 1) {
                    // @ts-ignore
                    pp1 = this.board.create('point', [() => this.getDecasteljauScheme(slider.Value())[r][i - 1].X(),
                        () => this.getDecasteljauScheme(slider.Value())[r][i - 1].Y()], {
                        // @ts-ignore
                        style: JXG.POINT_STYLE_X,
                        color: this.pointColors[r]
                    });
                } else {
                    pp1 = this.decasteljauPoints[this.decasteljauPoints.length - 1]
                }
                // @ts-ignore
                this.decasteljauPoints.push(pp1)

                pp2 = this.board.create('point', [() => this.getDecasteljauScheme(slider.Value())[r][i].X(),
                    () => this.getDecasteljauScheme(slider.Value())[r][i].Y()], {
                    // @ts-ignore
                    style: JXG.POINT_STYLE_X,
                    color: this.pointColors[r]
                });
                const segment = this.board!.create('segment', [pp1, pp2]);
                this.decasteljauSegments.push(segment)
                // @ts-ignore
                this.decasteljauPoints.push(pp1)
                // @ts-ignore
                this.decasteljauPoints.push(pp2)
            }
        }
        let drawingPoint = this.board?.create('point', [() => this.getDecasteljauScheme(slider.Value())[n - 1][0].X(), () => this.getDecasteljauScheme(slider.Value())[n - 1][0].Y()], {
            // @ts-ignore
            style: JXG.POINT_STYLE_X,
            color: this.pointColors[n - 1],
            trace: false
        });

        if (drawingPoint instanceof JXG.Point) {
            this.decasteljauPoints.push(drawingPoint)
        }

    }

    getDecasteljauScheme(t: number) {
        const cacheHash = this.generateCacheHash(t)
        if (this.cacheHash === cacheHash) {
            return this.cachedDecasteljauScheme
        } else {
            this.cachedDecasteljauScheme = this.pointControlledCurve.decasteljauScheme(t)
            this.cacheHash = cacheHash;
            return this.cachedDecasteljauScheme
        }
    }

    override addPoint(x: number, y: number) {
        super.addPoint(x, y);
        if (this.decasteljauSlider != null) {
            this.generateLineSegments(this.decasteljauSlider)
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    override removePoint(i: number) {
        super.removePoint(i);
        if (this.decasteljauSlider != null) {
            this.generateLineSegments(this.decasteljauSlider)
        } else if (this.lastDecasteljauT != null) {
            this.generateLineSegmentsForT(this.lastDecasteljauT)
        }
        if (!this.showingDecasteljauScheme) {
            this.hideDecasteljauScheme()
        }
        if (this.isShowingControlPolygon()) {
            this.showControlPolygon()
        }
    }

    subdivide(t: number): this {
        const [curve1, curve2]: BezierCurve[] = this.pointControlledCurve.subdivide(t);
        // Move this curve
        this.movePointsToNewPoints(curve1.getPoints())

        // Create second curve
        let curve2pointArray = curve2.getPoints().map(point => [point.X(), point.Y()])
        return new JSXBezierCurve(curve2pointArray, this.board) as this
    }

    elevate() {
        const elevated = this.pointControlledCurve.elevate()
        this.clearJxgPoints()
        const wrappedPoints = elevated.getPoints().map(point => this.createJSXGraphPoint(point.X(), point.Y()))
        this.pointControlledCurve.setPoints(wrappedPoints);
    }

    extrapolate(t: number) {
        const extrapolatedBezier: BezierCurve = this.pointControlledCurve.extrapolate(t)
        this.movePointsToNewPoints(extrapolatedBezier.getPoints())
    }

    protected getStartingCurve(points: number[][]): BezierCurve {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new BezierCurve(jsxPoints);
    }

    private generateCacheHash(t: number) {
        return "" + t + this.getCurve().getPoints().map(p => "" + p.X() + p.Y())
    }

}
