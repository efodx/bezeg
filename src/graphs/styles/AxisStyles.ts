import {AxisAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";

const axisStyle: AxisAttributes = {
    strokeWidth: () => SizeContext.strokeWidth,
    ticks: {
        // @ts-ignore
        strokeWidth: () => SizeContext.strokeWidth * 0.5,
        // @ts-ignore
        highlightStrokeWidth: () => SizeContext.strokeWidth * 0.5,
        // @ts-ignore
        // majorHeight: () => Contexts.majorHeight,
        // @ts-ignore
        minorHeight: () => SizeContext.minorHeight,
        label: {
            // @ts-ignore
            fontSize: () => SizeContext.fontSize * 0.6,
        }
    },
    lastArrow: false
}

export const AxisStyles = {
    default: axisStyle
}
