import {SegmentAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";
import {Colors} from "../bezier/utilities/Colors";

const segmentStyle: SegmentAttributes = {strokeWidth: () => SizeContext.strokeWidth, color: Colors[1]}

export const SegmentStyles = {
    default: segmentStyle
}
