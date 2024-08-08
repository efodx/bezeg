import {AxisAttributes, TicksOptions} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";
import {VisibilityContext} from "../context/VisibilityContext";

const tick: TicksOptions = {
    // @ts-ignore
    visible: () => VisibilityContext.ticksVisible(),
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
        // @ts-ignore
        visible: () => VisibilityContext.tickNumbersVisible(),
        parse: false,
        useMathJax: true,
        cssStyle: 'font-family: MJXZERO, MJXTEX',
        // @ts-ignore
        display: 'html'
    },
}

const tickX: TicksOptions = tick

const tickY: TicksOptions = {
    ...tick,
    label: {
        ...tick.label,
        // @ts-ignore
        offset: [-10, -5]
    }
}

function axisStyle(tick: TicksOptions): AxisAttributes {
    return {
        strokeWidth: () => SizeContext.strokeWidth,
        visible: () => VisibilityContext.axisVisible(),
        ticks: tick,
        lastArrow: false
    }
}

export const AxisStyles = {
    defaultX: axisStyle(tickX),
    defaultY: axisStyle(tickY)
}
