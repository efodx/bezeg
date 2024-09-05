import {SizeContext} from "../context/SizeContext";
import {Colors} from "../curves/bezier/utilities/Colors";

const curveStyle = {
    strokeWidth: () => SizeContext.strokeWidth,
    strokeColor: Colors[1]
};

export const CurveStyles = {
    default: curveStyle
};
