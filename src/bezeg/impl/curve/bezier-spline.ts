import {Point} from "../../api/point/point";
import {PolynomialBezierCurve} from "./polynomial-bezier-curve";
import {AbstractPointControlledCurve} from "./abstract-point-controlled-curve";

abstract class BezierSpline extends AbstractPointControlledCurve {
    protected bezierCurves: PolynomialBezierCurve[] = [];
    protected nonFreePoints: Array<Point> = [];
    protected b: number[] = [];
    protected alpha: number = 0;

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     */
    constructor(points: Array<Point>) {
        super(points);
        this.generateBezierCurves();
    }

    setAlpha(alpha: number) {
        this.alpha = alpha;
    }

    getAlpha() {
        return this.alpha;
    }

    abstract generateBezierCurves(): void;

    eval(t: number): Point {
        let n = this.bezierCurves.length;
        let u = this.getU();
        for (let i = 0; i < n; i++) {
            if (t < u[i + 1]) {
                t = t - u[i];
                t = t / (u[i + 1] - u[i]);
                return this.bezierCurves[i].eval(t);
            }
        }
        return this.bezierCurves[this.bezierCurves.length - 1].eval(1);
    }


    setB(j: number, b: number) {
        this.b[j] = b;
    }

    getB(j: number) {
        return this.b[j];
    }

    getNumOfBs() {
        return this.b.length;
    }

    getNonFreePoints() {
        return this.nonFreePoints;
    }

    override getPoints(): Point[] {
        return this.getAllCurvePoints();
    }

    getAllCurvePoints(): Point[] {
        const points: Point[] = [];
        points.push(...this.bezierCurves[0].getPoints());
        this.bezierCurves.slice(1).forEach(curve => {
            points.push(...curve.getPoints().slice(1));
        });
        return points;
    }

    override addPoint(point: Point) {
        super.addPoint(point);
        this.generateBezierCurves();
    }

    override removePoint(point: Point) {
        super.removePoint(point);
        this.generateBezierCurves();
    }

    override getBoundingBox() {
        let maxX = -Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        let minY = Infinity;
        // we include non-free points for this so the curve is always inside the bounding box, might change it to actual curve min and max
        const points = this.points.concat(this.getNonFreePoints());
        points.forEach(point => {
                if (point.X() > maxX) {
                    maxX = point.X();
                }
                if (point.Y() > maxY) {
                    maxY = point.Y();
                }
                if (point.X() < minX) {
                    minX = point.X();
                }
                if (point.Y() < minY) {
                    minY = point.Y();
                }
            }
        );
        return [minX, maxX, minY, maxY];
    }

    getUnderlyingCurves() {
        return this.bezierCurves;
    }

    protected getU() {
        const n = this.bezierCurves.length;
        const u = [0];
        for (let i = 0; i < n; i++) {
            let curve = this.bezierCurves[i];
            let pointStart = curve.getPoints()[0];
            let pointEnd = curve.getPoints()[curve.getPoints().length - 1];
            let d = Math.sqrt((pointStart.X() - pointEnd.X()) ** 2 + (pointStart.Y() - pointEnd.Y()) ** 2) ** this.alpha;
            u.push(u[u.length - 1] + d);
        }
        return u.map(t => t / u[u.length - 1]);
    }

}


export {BezierSpline};