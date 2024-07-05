import {AbstractJSXPointControlledCurve} from "./AbstractJSXPointControlledCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";

export abstract class AbstractJSXBezierCurve<T extends BezierCurve> extends AbstractJSXPointControlledCurve<T> {
    /**
     * Subdivides the curve at t.
     * This JSXBezierCurve becomes the part that was at [0,t] while the method returns the part from [t,1]
     * @param t
     */
    abstract subdivide(t: number): this

    abstract extrapolate(t: number): void

    abstract elevate(t: number): void
}