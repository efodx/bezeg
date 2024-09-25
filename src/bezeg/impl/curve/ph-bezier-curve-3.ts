import {PolynomialBezierCurve} from "./polynomial-bezier-curve";
import {Point} from "../../api/point/point";
import {PointImpl} from "../point/point-impl";

/**
 * Represents a PH Bezier curve.
 * The underlying curve is still a Bezier curve.
 * There are just certain restrictions.
 */
export class PhBezierCurve extends PolynomialBezierCurve {
    private nonFreePoints: Array<Point> = [];

    /**
     * @constructor
     * @param {Array.<Point>} points - Curve's control points
     */
    constructor(points: Array<Point>, degree: number) {
        super(points);
        // TODO degree+points check
        this.calculateNonFreePoints(degree);
    }

    getNonFreePoints(): Array<Point> {
        return this.nonFreePoints;
    }

    private calculateNonFreePoints(degree: number) {
        if (degree === 2) {
            // TODO calculate this efficiently!

            let xyCalc = () => {
                const points = this.getPoints();
                let L0 = Math.sqrt((points[1].X() - points[0].X()) ** 2 + (points[1].Y() - points[0].Y()) ** 2);
                let L1 = Math.sqrt((points[2].X() - points[1].X()) ** 2 + (points[2].Y() - points[1].Y()) ** 2);
                let L2 = L1 ** 2 / L0;

                let p0 = points[0];
                let p1 = points[1];
                let p2 = points[2];
                let Ax = p0.X() - p1.X();
                let Ay = p0.Y() - p1.Y();
                let Bx = p2.X() - p1.X();
                let By = p2.Y() - p1.Y();
                let cosTheta = (Ax * Bx + Ay * By) / Math.sqrt((Ax ** 2 + Ay ** 2) * (Bx ** 2 + By ** 2));
                let sinTheta = Math.sqrt(1 - cosTheta ** 2);

                let xCenter = points[2].X();
                let yCenter = points[2].Y();
                let x = points[1].X();
                let y = points[1].Y();
                x = x - xCenter;
                y = y - yCenter;
                let newX = cosTheta * x - sinTheta * y;
                let newY = sinTheta * x + cosTheta * y;

                let dx = newX;
                let dy = newY;
                // Normalize
                let scale = 1 / Math.sqrt(dx ** 2 + dy ** 2);
                dx = scale * dx;
                dy = scale * dy;


                newX = newX + xCenter;
                newY = newY + yCenter;

                return [xCenter + dx * L2, yCenter + dy * L2];
            };

            let nonFreePoint = new PointImpl(() => xyCalc()[0], () => xyCalc()[1]);
            // Zavrtimo P1 okoli P2 za Theta!
            this.addPoint(nonFreePoint);
            this.nonFreePoints.push(nonFreePoint);
        }
    }

}