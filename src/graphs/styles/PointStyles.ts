import {PointAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";
import {VisibilityContext} from "../context/VisibilityContext";


const pointStyle: PointAttributes = {
    // @ts-ignore
    size: () => SizeContext.pointSize,
    label: {// @ts-ignore
        fontSize: () => SizeContext.fontSize,
        useMathJax: true,
        parse: false,
        anchorY: "bottom",
        anchorX: "left",
        // @ts-ignore
        visible: () => VisibilityContext.pointsVisible()
    },
    name: "",
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


