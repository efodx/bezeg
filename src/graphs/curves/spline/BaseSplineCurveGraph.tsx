import BaseCurveGraph, {BaseGraphStates} from "../../base/BaseCurveGraph";
import {BezierSpline} from "../../../bezeg/impl/curve/bezier-spline";
import {AbstractJXGSplineCurve} from "../object/AbstractJXGSplineCurve";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";

export abstract class BaseSplineCurveGraph<S extends BaseGraphStates> extends BaseCurveGraph<any, S> {
    override componentDidMount() {
        super.componentDidMount();
        this.getFirstJxgCurve().setAttributes({allowShowPoints: true});
    }

    override getFirstCurve(): BezierSpline {
        return super.getFirstCurve() as BezierSpline;
    }

    override getFirstJxgCurve(): AbstractJXGSplineCurve<any> {
        return super.getFirstJxgCurve() as AbstractJXGSplineCurve<any>;
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(<OnOffSwitch
            onChange={(checked) => this.setLabelAll(checked)}
            label={"Označi vse točke"}
            initialState={this.getFirstJxgCurve().getLabelAll()}></OnOffSwitch>, <OnOffSwitch
            onChange={(checked) => this.getFirstJxgCurve().setHideFixed(checked)}
            label={"Skrij fiksne točke"}
            initialState={this.getFirstJxgCurve().getHideFixed()}></OnOffSwitch>) : [];
    }

    private setLabelAll(checked: boolean) {
        this.getFirstJxgCurve().setLabelAll(checked);
        this.boardUpdate();
    }
}