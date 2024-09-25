import {BezierSpline} from "./bezier-spline";
import {PolynomialBezierCurve} from "./polynomial-bezier-curve";
import {PointImpl} from "../point/point-impl";
import {Point} from "../../api/point/point";

export class GenericBezierSpline extends BezierSpline {
    protected degree: number;
    protected continuity: number;

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     * @param degree
     * @param continuity
     */
    constructor(points: Array<Point>, degree: number, continuity: number) {
        super(points);
        this.bezierCurves = [];
        this.degree = degree;
        this.continuity = continuity;
        this.generateBezierCurves();
    }

    generateBezierCurves() {
        this.bezierCurves = [];
        this.nonFreePoints = [];
        let step = this.degree - this.continuity;
        let bezierCurvePoints = this.points.slice(0, this.degree + 1);
        this.bezierCurves.push(new PolynomialBezierCurve(bezierCurvePoints));

        for (let i = this.degree; i < this.points.length - 1; i = i + step) {
            let bezierCurvePoints = [this.points[i]];

            let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1];
            const l = this.bezierCurves.length;
            const nonFreePoints = [];
            for (let j = 1; j <= this.continuity; j++) {
                // TODO MAKE THIS EFFICIENT
                let nonFreePoint = new PointImpl(() => {
                    const u = this.getU();
                    const deltaU1 = u[l] - u[l - 1];
                    const deltaU2 = u[l + 1] - u[l];

                    let nextT = (deltaU2 + deltaU1) / deltaU1;
                    const decasteljau = previousBezierCurve.decasteljauScheme(nextT);
                    return decasteljau[this.degree][this.degree - j].X();
                }, () => {
                    const u = this.getU();
                    const deltaU1 = u[l] - u[l - 1];
                    const deltaU2 = u[l + 1] - u[l];

                    let nextT = (deltaU2 + deltaU1) / deltaU1;

                    const decasteljau = previousBezierCurve.decasteljauScheme(nextT);
                    return decasteljau[this.degree][this.degree - j].Y();
                });
                nonFreePoints.push(nonFreePoint);
                bezierCurvePoints.push(nonFreePoint);
            }

            bezierCurvePoints.push(...this.points.slice(i + 1, i + step + 1));
            this.nonFreePoints.push(...nonFreePoints);
            this.bezierCurves.push(new PolynomialBezierCurve(bezierCurvePoints));
        }
    }

    setContinuity(continuity: number) {
        this.continuity = continuity;
    }

    getContinuity() {
        return this.continuity;
    }

    setDegree(degree: number) {
        this.degree = degree;
    }

    getDegree() {
        return this.degree;
    }
}