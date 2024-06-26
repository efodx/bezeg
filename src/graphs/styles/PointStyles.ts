import {PointAttributes} from "jsxgraph";
import {SizeContext} from "../../Contexts";


const pointStyle: PointAttributes = {
    // @ts-ignore
    size: () => SizeContext.pointSize,
    label: {// @ts-ignore
        fontSize: () => SizeContext.fontSize,
        useMathJax: true,
        parse: false,
        anchorY: "bottom",
        anchorX: "left"
    }
}

const fixedPointStyle: PointAttributes = {
    ...pointStyle,
    fixed: true,
    color: "blue"
}


function pi(i: number): PointAttributes {
    return {
        ...pointStyle,
        name: "$$p_{" + i + "}$$"
    }
}

export const PointStyles = {
    pi: pi,
    default: pointStyle,
    fixed: fixedPointStyle
}


