import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {BaseGraphStates} from "../base/BaseCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<any, BaseGraphStates> {

    defaultPreset(): string {
        return '["JSXRationalBezierCurve|{\\"points\\":[[-3,2],[0,-2],[1,2],[3,-2]],\\"weights\\":[1,2,1,1]}"]';
    }

    override presets(): string {
        return "rational-bezier"
    }

}


export default RationalBezierCurveGraph;
