import {BezierSpline} from "./bezier-spline";
import {BezierCurveImpl} from "./bezier-curve-impl";
import {PointImpl} from "../point/point-impl";
import {Point} from "../../api/point/point";

export class C2QubicBezierSpline extends BezierSpline {

    override getU() {
        const u = [0];
        for (let i = 1; i < this.points.length - 2; i++) {
            let pointStart = this.points[i];
            let pointEnd = this.points[i + 1];
            let d = Math.sqrt((pointStart.X() - pointEnd.X()) ** 2 + (pointStart.Y() - pointEnd.Y()) ** 2) ** this.alpha;
            u.push(u[u.length - 1] + d);
        }
        return u.map(t => t / u[u.length - 1]);
    }

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
                () => {
                    const u = this.getU();
                    let du1 = u[l - 1] - u[l - 2];
                    let du2 = u[l] - u[l - 1];
                    let du3 = u[l + 1] - u[l];
                    let duSum = du1 + du2 + du3;
                    console.log("points len:", points.length);
                    console.log("points len-3:", points.length - 2);
                    console.log("u len:", u.length);
                    return (du2 + du3) / duSum * points[l].X() + du1 / duSum * points[l + 1].X();
                },
                () => {
                    const u = this.getU();
                    let du1 = u[l - 1] - u[l - 2];
                    let du2 = u[l] - u[l - 1];
                    let du3 = u[l + 1] - u[l];
                    let duSum = du1 + du2 + du3;
                    return (du2 + du3) / duSum * points[l].Y() + du1 / duSum * points[l + 1].Y();
                });
            const p2 = new PointImpl(
                () => {
                    const u = this.getU();
                    let du1 = u[l - 1] - u[l - 2];
                    let du2 = u[l] - u[l - 1];
                    let du3 = u[l + 1] - u[l];
                    let duSum = du1 + du2 + du3;

                    return du3 / duSum * points[l].X() + (du1 + du2) / duSum * points[l + 1].X();
                },
                () => {
                    const u = this.getU();
                    let du1 = u[l - 1] - u[l - 2];
                    let du2 = u[l] - u[l - 1];
                    let du3 = u[l + 1] - u[l];
                    let duSum = du1 + du2 + du3;

                    return du3 / duSum * points[l].Y() + (du1 + du2) / duSum * points[l + 1].Y();
                });
            nonFreePoints.push(p);
            nonFreePoints.push(p2);
            const curveNum = l - 1;
            bezpoints[curveNum][1] = p;
            bezpoints[curveNum][2] = p2;
        }
        const newPoint2 = new PointImpl(
            () => {
                const u = this.getU();
                let du1 = u[u.length - 3] - u[u.length - 2];
                let du2 = u[u.length - 2] - u[u.length - 1];
                let duSum = du1 + du2;
                return du2 / duSum * points[points.length - 3].X() + du1 / duSum * points[points.length - 2].X();
            },
            () => {
                const u = this.getU();
                let du1 = u[u.length - 3] - u[u.length - 2];
                let du2 = u[u.length - 2] - u[u.length - 1];
                let duSum = du1 + du2;
                return du2 / duSum * points[points.length - 3].Y() + du1 / duSum * points[points.length - 2].Y();
            });

        nonFreePoints.push(newPoint2);
        bezpoints[bezpoints.length - 1][1] = newPoint2;

        for (let l = 1; l < points.length - 3; l++) {
            const p = new PointImpl(
                () => {
                    const u = this.getU();
                    let du1 = u[l] - u[l - 1];
                    let du2 = u[l + 1] - u[l];
                    let duSum = du1 + du2;
                    return du2 / duSum * bezpoints[l - 1][2].X() + du1 / duSum * bezpoints[l][1].X();
                },
                () => {
                    const u = this.getU();
                    let du1 = u[l] - u[l - 1];
                    let du2 = u[l + 1] - u[l];
                    let duSum = du1 + du2;
                    return du2 / duSum * bezpoints[l - 1][2].Y() + du1 / duSum * bezpoints[l][1].Y();
                });
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