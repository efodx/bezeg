import BaseGraph, {BaseGraphProps, BaseGraphStates} from "./BaseGraph";
import {JSXBezierCurve} from "../bezier/JSXBezierCurve";
import Slider from "../../inputs/Slider";
import {BezierCurve} from "../../bezeg/interfaces/bezier-curve";
import {CSSProperties} from "react";
import {Button} from "react-bootstrap";


interface BaseCurveGraphProps extends BaseGraphProps {
    allowSelectedCurveSubdivision: boolean,
    allowSelectedCurveExtrapolation: boolean,
    allowSelectedCurveDecasteljau: boolean,
    allowSelectedCurveElevation: boolean,
    allowSelectedCurveShrink: boolean
}

export abstract class BaseCurveGraph<P extends BaseCurveGraphProps, S extends BaseGraphStates> extends BaseGraph<BezierCurve, JSXBezierCurve, P, S> {
    static defaultProps = {
        ...BaseGraph.defaultProps,
        allowSelectedCurveSubdivision: true,
        allowSelectedCurveElevation: true,
        allowSelectedCurveExtrapolation: true,
        allowSelectedCurveDecasteljau: true
    }
    curveCommandStyle = {}
    private subdivisionT: number = 0.5;
    private extrapolationT: number = 1.2;
    private decasteljauT: number = 0.5;
    private subdivisionPoint: JXG.Point | null = null;
    private extrapolationPoint: JXG.Point | null = null;

    newJSXBezierCurve(points: number[][]): JSXBezierCurve {
        return new JSXBezierCurve(points, this.board);
    }

    override getSelectedCurveCommands(): JSX.Element[] {
        this.createSubdivisionPoint()
        this.createExtrapolationPoint()
        const selectedCurveCommands = super.getSelectedCurveCommands()
        if (this.props.allowSelectedCurveSubdivision) {
            selectedCurveCommands.push(<div onMouseEnter={() => this.showSubdivisionPoint()}
                                            onMouseLeave={() => this.hideSubdivisionPoint()}>
                <Slider min={0} max={1}
                        initialValue={this.subdivisionT}
                        onChange={(t) => this.setSubdivisionT(t)}></Slider>
                <Button variant={"dark"} onClick={() => this.subdivideSelectedCurve()}>Subdiviziraj</Button>
            </div>)
        }
        if (this.props.allowSelectedCurveExtrapolation) {
            selectedCurveCommands.push(<div onMouseEnter={() => this.showExtrapolationPoint()}
                                            onMouseLeave={() => this.hideExtrapolationPoint()}>
                <Slider min={1} max={1.5}
                        initialValue={this.extrapolationT}
                        onChange={(t) => this.setExtrapolationT(t)}></Slider>
                <Button variant={"dark"}
                        onClick={() => this.extrapolateSelectedCurve(this.extrapolationT)}>Ekstrapoliraj</Button>
            </div>)
        }
        if (this.props.allowSelectedCurveShrink) {
            selectedCurveCommands.push(<div onMouseEnter={() => this.showSubdivisionPoint()}
                                            onMouseLeave={() => this.hideSubdivisionPoint()}>
                <Slider min={0} max={1}
                        initialValue={this.subdivisionT}
                        onChange={(t) => this.setSubdivisionT(t)}></Slider>
                <Button variant={"dark"} onClick={() => this.extrapolateSelectedCurve(this.subdivisionT)}>Skrči</Button>
            </div>)
        }
        if (this.props.allowSelectedCurveDecasteljau) {
            selectedCurveCommands.push(<div onMouseEnter={() => this.showSelectedCurveDecasteljauScheme()}
                                            onMouseLeave={() => this.hideSelectedCurveDecasteljauScheme()}>
                <Slider min={0} max={1}
                        initialValue={this.decasteljauT}
                        onChange={(t) => this.setDecasteljauT(t)}></Slider>
            </div>)
        }
        if (this.props.allowSelectedCurveElevation) {
            selectedCurveCommands.push(<div>
                <Button variant={"dark"} onClick={() => this.elevateSelectedCurve()}>Dvigni stopnjo</Button></div>)
        }
        return selectedCurveCommands;
    }

    showSubdivisionPoint() {
        this.subdivisionPoint?.show()
    }

    hideSubdivisionPoint() {
        this.subdivisionPoint?.hide()
    }

    showExtrapolationPoint() {
        this.getSelectedCurve().setIntervalEnd(() => this.extrapolationT)
        this.extrapolationPoint?.show()
    }

    hideExtrapolationPoint() {
        this.getSelectedCurve().setIntervalEnd(1)
        this.extrapolationPoint?.hide()
    }

    extrapolateSelectedCurve(t: number) {
        this.board.suspendUpdate()
        this.getSelectedCurve().extrapolate(t)
        this.board.unsuspendUpdate()
    }

    subdivideSelectedCurve() {
        this.board.suspendUpdate()
        let newCurve = this.getSelectedCurve().subdivide(this.subdivisionT)
        this.jsxBezierCurves.push(newCurve);
        this.deselectSelectedCurve()
        this.board.unsuspendUpdate()
    }

    elevateSelectedCurve() {
        this.board.suspendUpdate()
        this.getSelectedCurve().elevate()
        if (this.getSelectedCurve().isShowingControlPolygon()) {
            this.getSelectedCurve().showControlPolygon()
        }
        this.board.unsuspendUpdate()
    }

    override deselectSelectedCurve() {
        if (this.subdivisionPoint) {
            // @ts-ignore
            this.board.removeObject(this.subdivisionPoint)
        }
        if (this.extrapolationPoint) {
            this.board.removeObject(this.extrapolationPoint)
        }
        super.deselectSelectedCurve();
        this.subdivisionPoint = null
        this.extrapolationPoint = null
    }

    private setSubdivisionT(t: number) {
        this.subdivisionT = t
        this.board.update()
    }

    private setExtrapolationT(t: number) {
        this.extrapolationT = t
        this.board.update()
    }

    private createSubdivisionPoint() {
        if (this.board && !this.subdivisionPoint && this.getSelectedCurve()) {
            this.subdivisionPoint = this.board.create('point', [() => this.getSelectedCurve().getCurve().calculatePointAtT(this.subdivisionT).X(),
                () => this.getSelectedCurve().getCurve().calculatePointAtT(this.subdivisionT).Y()]);
            this.subdivisionPoint.hide()
        }
    }

    private createExtrapolationPoint() {
        if (this.board && !this.extrapolationPoint && this.getSelectedCurve()) {
            this.extrapolationPoint = this.board.create('point', [() => this.getSelectedCurve().getCurve().calculatePointAtT(this.extrapolationT).X(),
                () => this.getSelectedCurve().getCurve().calculatePointAtT(this.extrapolationT).Y()]);
            this.extrapolationPoint.hide()
        }
    }

    private showSelectedCurveDecasteljauScheme() {
        this.board.suspendUpdate()
        this.getSelectedCurve().showDecasteljauSchemeForT(this.decasteljauT)
        this.board.unsuspendUpdate()

    }

    private hideSelectedCurveDecasteljauScheme() {
        this.board.suspendUpdate()
        this.getSelectedCurve().hideDecasteljauScheme()
        this.board.unsuspendUpdate()
    }

    private setDecasteljauT(t: number) {
        this.decasteljauT = t;
        this.showSelectedCurveDecasteljauScheme()
    }

    private getCurveCommandStyle(): CSSProperties {
        return this.curveCommandStyle
    }

}

export type {BaseCurveGraphProps}