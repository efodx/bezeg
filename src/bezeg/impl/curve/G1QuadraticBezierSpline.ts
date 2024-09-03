import {BezierSpline} from "./bezier-spline";
import {PolynomialBezierCurve} from "./polynomial-bezier-curve";
import {PointImpl} from "../point/point-impl";

export class G1QuadraticBezierSpline extends BezierSpline {

    generateBezierCurves() {
        let step = 2;
        this.b = [];
        this.nonFreePoints = [];
        this.bezierCurves = [];
        for (let i = 0; i < this.points.length - 1; i = i + step - 1) {
            let bezierCurvePoints = this.points.slice(i, i + step);
            let previousBezierCurve = this.bezierCurves[this.bezierCurves.length - 1];
            if (!previousBezierCurve) {
                bezierCurvePoints = this.points.slice(0, step);
                this.bezierCurves.push(new PolynomialBezierCurve(bezierCurvePoints));
            } else {
                let previousPoint = previousBezierCurve.getPoints()[previousBezierCurve.getPoints().length - 2];
                let startingPoint = bezierCurvePoints[0];

                this.b.push(1);
                let j = this.b.length - 1;
                let nonFreePoint = new PointImpl(() => startingPoint.X() + this.b[j] * (startingPoint.X() - previousPoint.X()), () => startingPoint.Y() + this.b[j] * (startingPoint.Y() - previousPoint.Y()));
                this.nonFreePoints.push(nonFreePoint);
                bezierCurvePoints.splice(1, 0, nonFreePoint);
                this.bezierCurves.push(new PolynomialBezierCurve(bezierCurvePoints));
            }
        }
    }

}