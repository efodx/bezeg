import {SegmentAttributes} from "jsxgraph";
import {SizeContext} from "../../Contexts";

const segmentStyle: SegmentAttributes = {strokeWidth: () => SizeContext.strokeWidth}

export const SegmentStyles = {
    default: segmentStyle
}
