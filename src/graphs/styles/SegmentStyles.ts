import {SegmentAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";
import {Color} from "../bezier/utilities/Colors";

const segmentStyle: SegmentAttributes = {strokeWidth: () => SizeContext.strokeWidth, color: Color.R}

export const SegmentStyles = {
    default: segmentStyle
}
