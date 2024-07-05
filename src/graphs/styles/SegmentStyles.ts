import {SegmentAttributes} from "jsxgraph";
import {SizeContext} from "../context/SizeContext";

const segmentStyle: SegmentAttributes = {strokeWidth: () => SizeContext.strokeWidth}

export const SegmentStyles = {
    default: segmentStyle
}
