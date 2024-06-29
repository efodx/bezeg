import '../../App.css';
import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";
import {BaseCurveGraphProps} from "../base/BaseCurveGraph";

class CubicPhBezierCurveGraph extends BasePhBezierCurveGraph<BaseCurveGraphProps, BasePhBezierCurveGraphStates> {

    getStartingHodographs(): number[][] {
        return [[-3, 2], [2, 2]];
    }

    getStartingPoints(): number[][] {
        return [[0, 0]];
    }
}

export default CubicPhBezierCurveGraph;