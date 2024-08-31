import {BezierSpline} from "./bezier-spline";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {PointImpl} from "../point/point-impl";
import {Point} from "../../api/point/point";

export class C2QubicBezierSpline extends BezierSpline {

    generateBezierCurves() {
        const points = this.points;
        const numOfcurves = this.points.length - 3;
        const bezpoints = new Array(numOfcurves);
        for (let i = 0; i < bezpoints.length; i++) {
            bezpoints[i] = new Array(3).fill(undefined);
        }
        const nonFreePoints = [];
        bezpoints[0][0] = points[0];
        bezpoints[0][1] = points[1];
        const newPoint = new PointImpl(
            () => 1 / 2 * points[1].X() + 1 / 2 * points[2].X(),
            () => 1 / 2 * points[1].Y() + 1 / 2 * points[2].Y());
        bezpoints[0][2] = newPoint;
        nonFreePoints.push(newPoint);
        for (let l = 2; l < points.length - 3; l++) {
            const p = new PointImpl(
                () => 2 / 3 * points[l].X() + 1 / 3 * points[l + 1].X(),
                () => 2 / 3 * points[l].Y() + 1 / 3 * points[l + 1].Y());
            const p2 = new PointImpl(
                () => 1 / 3 * points[l].X() + 2 / 3 * points[l + 1].X(),
                () => 1 / 3 * points[l].Y() + 2 / 3 * points[l + 1].Y());
            nonFreePoints.push(p);
            nonFreePoints.push(p2);
            const curveNum = l - 1;
            bezpoints[curveNum][1] = p;
            bezpoints[curveNum][2] = p2;
        }
        const newPoint2 = new PointImpl(
            () => 1 / 2 * points[points.length - 3].X() + 1 / 2 * points[points.length - 2].X(),
            () => 1 / 2 * points[points.length - 3].Y() + 1 / 2 * points[points.length - 2].Y());

        nonFreePoints.push(newPoint2);
        bezpoints[bezpoints.length - 1][1] = newPoint2;

        for (let l = 1; l < points.length - 3; l++) {
            const p = new PointImpl(
                () => 1 / 2 * bezpoints[l - 1][2].X() + 1 / 2 * bezpoints[l][1].X(),
                () => 1 / 2 * bezpoints[l - 1][2].Y() + 1 / 2 * bezpoints[l][1].Y());
            const curveNum = l - 1;
            nonFreePoints.push(p);
            bezpoints[curveNum][3] = p;
            bezpoints[curveNum + 1][0] = p;
        }

        bezpoints[bezpoints.length - 1][2] = points[points.length - 2];
        bezpoints[bezpoints.length - 1][3] = points[points.length - 1];

        const bezcurves = [];
        for (const points of bezpoints) {
            bezcurves.push(new BezierCurveImpl(points));
        }

        this.nonFreePoints = nonFreePoints;
        this.bezierCurves = bezcurves;
    }

    override getPoints(): Point[] {
        return this.points;
    }

}