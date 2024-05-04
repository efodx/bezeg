/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve} from "./JSXBezierCurve";
import {PhBezierCurve} from "../bezeg/ph-bezier-curve";

export class JSXPHBezierCurve extends JSXBezierCurve {

    protected getStartingCurve(points: number[][]): PhBezierCurve {
        let jsxPoints = points.map(point => this.createJSXGraphPoint(point[0], point[1]))
        return new PhBezierCurve(jsxPoints);
    }
}
