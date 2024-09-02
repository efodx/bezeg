import BaseCurveGraph, {BaseGraphStates} from "../base/BaseCurveGraph";
import {BezierSpline} from "../../bezeg/impl/curve/bezier-spline";
import {JSXSplineCurve} from "../object/JSXSplineCurve";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";

export abstract class BaseSplineCurveGraph<S extends BaseGraphStates> extends BaseCurveGraph<any, S> {
    override componentDidMount() {
        super.componentDidMount();
        this.getFirstJsxCurve().setAttributes({allowShowPoints: true});
    }

    override getFirstCurve(): BezierSpline {
        return super.getFirstCurve() as BezierSpline;
    }

    override getFirstJsxCurve(): JSXSplineCurve<any> {
        return super.getFirstJsxCurve() as JSXSplineCurve<any>;
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(<OnOffSwitch
            onChange={(checked) => this.setLabelAll(checked)}
            label={"Označi vse točke"}
            initialState={this.getFirstJsxCurve().getLabelAll()}></OnOffSwitch>, <OnOffSwitch
            onChange={(checked) => this.getFirstJsxCurve().setHideFixed(checked)}
            label={"Skrij fiksne točke"}
            initialState={this.getFirstJsxCurve().getHideFixed()}></OnOffSwitch>) : [];
    }

    private setLabelAll(checked: boolean) {
        this.getFirstJsxCurve().setLabelAll(checked);
        this.boardUpdate();
    }
}