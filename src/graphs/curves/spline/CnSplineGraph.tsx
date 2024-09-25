import {BaseSplineCurveGraph} from "./BaseSplineCurveGraph";
import {JXGGenericSplineCurve} from "../object/JXGGenericSplineCurve";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {CountSetter} from "../../../inputs/CountSetter";

class Graph extends BaseSplineCurveGraph<BaseGraphStates> {

    override presets(): string {
        return "cn-spline";
    }

    defaultPreset(): any {
        return [["JSXGenericSplineCurve", {
            "points": [[-3, 2], [-4, 0.5], [-3.5, -1], [-1.5, -2, 5], [0.5, 0], [2.5, 1.5], [4, -2]],
            "degree": 2,
            "continuity": 1,
            "state": {
                "showingJxgPoints": true, "showingControlPolygon": false, "showingConvexHull": false
            }
        }]];
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat([
            <div>
                <div>Stopnja zveznosti</div>
                <CountSetter onPlus={() => this.increaseContinuity()} onCenter={() => 1}
                             n={this.getFirstJxgCurve().getCurve().getContinuity()}
                             onMinus={() => this.decreaseContinuity()} min={0}
                             max={() => this.getFirstJxgCurve().getCurve().getDegree() - 1}></CountSetter>
            </div>, <div>
                <div>Stopnja zlepka</div>
                <CountSetter onPlus={() => this.increaseDegree()} onCenter={() => 1}
                             n={this.getFirstJxgCurve().getCurve().getDegree()}
                             onMinus={() => this.decreaseDegree()}
                             min={() => this.getFirstJxgCurve().getCurve().getContinuity() + 1}
                             max={() => this.getFirstJxgCurve().getCurve().getPoints().length}></CountSetter>
            </div>]) : [];
    }

    override getFirstJxgCurve(): JXGGenericSplineCurve {
        return super.getFirstJxgCurve() as JXGGenericSplineCurve;
    }

    private increaseContinuity() {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().increaseContinuity();
        this.unsuspendBoardUpdate();
    }

    private decreaseContinuity() {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().decreaseContinuity();
        this.unsuspendBoardUpdate();
    }

    private increaseDegree() {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().increaseDegree();
        this.unsuspendBoardUpdate();
    }

    private decreaseDegree() {
        this.board.suspendUpdate();
        this.getFirstJxgCurve().decreaseDegree();
        this.unsuspendBoardUpdate();

    }
}

export default Graph;
