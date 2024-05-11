import '../App.css';
import {BaseCurveGraph, BaseCurveGraphProps} from "./BaseCurveGraph";
import {BaseGraphStates} from "./BaseGraph";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";
import {PhBezierCurve} from "../bezeg/ph-bezier-curve";
import Slider from "../inputs/Slider";

class QuinticPhBezierCurve extends BaseCurveGraph<BaseCurveGraphProps, BaseGraphStates> {
    initialize() {
        const points = [[-4, -3], [-3, 2], [2, 2], [1, 3]]
        this.createJSXBezierCurve(points)

        const curve = this.getFirstCurve() as PhBezierCurve
        const offsetCurve = curve.getOffsetCurve()
        offsetCurve.getPoints().map(point => this.createJSXGraphPoint(() => point.X(), () => point.Y()))
        this.board.create('curve',
            [(t: number) => {
                return offsetCurve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return offsetCurve.calculatePointAtT(t).Y();
                },
                0,
                1
            ]
        );
    }

    override newJSXBezierCurve(points: number[][]): JSXPHBezierCurve {
        return new JSXPHBezierCurve(points, this.board);
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(<Slider min={-3} max={3} initialValue={1} step={0.1}
                                                       onChange={e => this.setOffsetCurveDistance(e)}/>);
    }

    getFirstCurveAsPHBezierCurve() {
        return this.getFirstCurve() as PhBezierCurve
    }

    private setOffsetCurveDistance(e: number) {
        this.board.suspendUpdate()
        this.getFirstCurveAsPHBezierCurve().setOffsetCurveDistance(e);
        this.board.unsuspendUpdate()
    }
}

export default QuinticPhBezierCurve;
