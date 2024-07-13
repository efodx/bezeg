import {AbstractJSXPointControlledCurve, PointControlledCurveAttributes} from "./AbstractJSXPointControlledCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";

export interface BezierCurveAttributes extends PointControlledCurveAttributes {
    allowSubdivision: boolean,
    allowExtrapolation: boolean,
    allowElevation: boolean
    allowDecasteljau: boolean,
    allowShrink: boolean,
    allowShowPoints: boolean
}

export abstract class AbstractJSXBezierCurve<T extends BezierCurve, Attr extends BezierCurveAttributes> extends AbstractJSXPointControlledCurve<T, Attr> {

    protected subdivisionResultConsumer?: (curve: this) => void

    /**
     * Subdivides the curve at t.
     * This JSXBezierCurve becomes the part that was at [0,t] while the method returns the part from [t,1]
     * @param t
     */
    abstract subdivide(t: number): this

    abstract extrapolate(t: number): void

    abstract elevate(t: number): void

    setSubdivisionResultConsumer(consumer: ((curve: this) => void)) {
        this.subdivisionResultConsumer = consumer
    }

}