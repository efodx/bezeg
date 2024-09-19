import {PointAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";
import {VisibilityContext} from "../context/VisibilityContext";
import {Colors} from "../curves/bezier/utilities/Colors";


const pointStyle: PointAttributes = {
    // @ts-ignore
    size: () => SizeContext.pointSize,
    label: {// @ts-ignore
        fontSize: () => SizeContext.fontSize,
        useMathJax: true,
        parse: false,
        anchorY: "bottom",
        anchorX: "left",
        //   anchorX: "middle",
        // @ts-ignore
        offset: () => [0, SizeContext.fontSize * -0.3],
        // @ts-ignore
        visible: () => VisibilityContext.pointsVisible()
    },
    name: "",
};

const fixedPointStyle: PointAttributes = {
    ...pointStyle,
    fixed: true,
    color: Colors[2]
};


function pi(i: number, visible: () => boolean): PointAttributes {
    return {
        ...pointStyle,
        name: "$$p_{" + i + "}$$",
        // name: "$$p_{\\scriptsize" + i + "}$$",
        // @ts-ignore
        visible: visible
    };
}

export const PointStyles = {
    pi: pi,
    default: pointStyle,
    fixed: fixedPointStyle
};


