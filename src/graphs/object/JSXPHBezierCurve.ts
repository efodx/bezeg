/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurve, JSXBezierCurveConstructorParams, JSXBezierCurveState} from "./JSXBezierCurve";
import {PhBezierCurve} from "../../bezeg/impl/curve/ph-bezier-curve";
import {PointImpl} from "../../bezeg/impl/point/point-impl";
import {PointStyles} from "../styles/PointStyles";
import {Board} from "jsxgraph";
import {BezierCurveAttributes} from "./AbstractJSXBezierCurve";
import {BezierCurve} from "../../bezeg/api/curve/bezier-curve";
import {Attributes} from "../attributes/Attributes";
import {Colors} from "../bezier/utilities/Colors";
import {CurveStyles} from "../styles/CurveStyles";
import {CacheContext} from "../context/CacheContext";
import {PhBezierCurveCommands} from "./inputs/PhBezierCurveCommands";
import {SizeContext} from "../context/SizeContext";


interface JSXPHBezierCurveConstructorParams extends JSXBezierCurveConstructorParams {
    hodographs: number[][],
    state: JSXPHBezierCurveState
}

interface JSXPHBezierCurveState extends JSXBezierCurveState {
    showOffsetCurve: boolean;
    showOffsetCurveControlPoints: boolean;
    showOffsetCurveControlPointsLines: boolean;
    d: number
}

export class JSXPHBezierCurve extends JSXBezierCurve {

    private showOffsetCurve: boolean = false;
    private showOffsetCurveControlPoints: boolean = false;
    private showOffsetCurveControlPointsLines: boolean = false;
    private jsxOffsetCurves!: JXG.Curve[];
    private jxgOffsetControlPoints: JXG.Point[] = [];
    private jxgOffsetControlPointsLines: JXG.Line[] = [];

    constructor(points: number[][], board: Board, attributes?: BezierCurveAttributes) {
        super(points, board, attributes);
        this.setAttributes({...Attributes.bezierDisabled, allowShowConvexHull: false});
    }

    static override toDto(curve: JSXBezierCurve): any {
        return {
            points: [curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()])[0]],
            hodographs: (curve.getCurve() as PhBezierCurve).w.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        } as JSXPHBezierCurveConstructorParams;
    }

    static override fromDto(params: JSXPHBezierCurveConstructorParams, board: Board): JSXBezierCurve {
        const curve = new JSXPHBezierCurve(params.points.concat(params.hodographs), board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve as JSXBezierCurve;
    }

    override importState(state: JSXPHBezierCurveState) {
        super.importState(state);
        if (state.d) {
            this.getCurve().setOffsetCurveDistance(state.d);
        }
        this.generateJsxOffsetCurves(!state.showOffsetCurve);
        this.setShowOffsetCurve(state.showOffsetCurve);
        this.setShowOffsetCurveControlPoints(state.showOffsetCurveControlPoints);
    }

    override exportState(): JSXPHBezierCurveState {
        return {
            ...super.exportState(),
            showOffsetCurveControlPoints: this.showOffsetCurveControlPoints,
            showOffsetCurveControlPointsLines: this.showOffsetCurveControlPointsLines,
            showOffsetCurve: this.showOffsetCurve,
            d: this.getCurve().getOffsetCurveDistance()

        } as JSXPHBezierCurveState;
    }

    setOffsetCurveDistance(d: number) {
        this.getCurve().setOffsetCurveDistance(d);
        CacheContext.update();
        this.board.update();
    }

    isShowingOffsetCurve(): boolean {
        return this.showOffsetCurve;
    }

    setShowOffsetCurve(show: boolean) {
        if (this.jsxOffsetCurves === undefined && show) {
            this.generateJsxOffsetCurves(false);
        }
        CacheContext.update();
        if (show) {
            this.jsxOffsetCurves.forEach(curve => curve.show());
        } else {
            this.jsxOffsetCurves.forEach(curve => curve.hideElement());
        }
        this.showOffsetCurve = show;
    }

    override getStartingCurve(points: number[][]): BezierCurve {
        const pointsImpl = points.map(p => new PointImpl(p[0], p[1]));
        const curve = new PhBezierCurve(pointsImpl.slice(0, 1), pointsImpl.slice(1));
        curve.getPoints().map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.pi(i)));
        return curve;
    }


    generateJxgOffsetCurveControlPoints() {
        this.getCurve().getOffsetCurves().forEach(curve => {
            let jxgOffsetControlPoints = curve.getPoints().map((point, r) => this.board.create('point', [() => point.X(), () => point.Y()], {
                ...PointStyles.default,
                color: Colors[r]
            }));
            // @ts-ignore
            this.jxgOffsetControlPoints.push(...jxgOffsetControlPoints);
        });
    }

    setShowOffsetCurveControlPointsLines(checked: boolean) {
        this.board.removeObject(this.jxgOffsetControlPointsLines);
        this.jxgOffsetControlPointsLines = [];
        if (checked) {
            this.generateLinesBetweenOffsetCurvePoints();
        }
        this.showOffsetCurveControlPointsLines = checked;
    }

    isShowingOffsetCurveControlPointsLines() {
        return this.showOffsetCurveControlPointsLines;
    }

    setShowOffsetCurveControlPoints(checked: boolean) {
        this.board.removeObject(this.jxgOffsetControlPoints);
        this.jxgOffsetControlPoints = [];
        if (checked) {
            this.generateJxgOffsetCurveControlPoints();
            if (this.showOffsetCurveControlPointsLines) {
                this.generateLinesBetweenOffsetCurvePoints();
            }
        }

        this.showOffsetCurveControlPoints = checked;
    }

    isShowingOffsetCurveControlPoints() {
        return this.showOffsetCurveControlPoints;
    }


    addOffsetCurve() {
        this.board.suspendUpdate();
        this.getCurve().addOffsetCurve();
        this.generateJsxOffsetCurves();
        this.setShowOffsetCurveControlPoints(this.showOffsetCurveControlPoints);
        this.setShowOffsetCurveControlPointsLines(this.showOffsetCurveControlPointsLines);
        this.board.unsuspendUpdate();
    }

    removeOffsetCurve() {
        this.board.suspendUpdate();
        this.getCurve().removeOffsetCurve();
        this.generateJsxOffsetCurves();
        this.setShowOffsetCurveControlPoints(this.showOffsetCurveControlPoints);
        this.setShowOffsetCurveControlPointsLines(this.showOffsetCurveControlPointsLines);
        this.board.unsuspendUpdate();
    }

    generateLinesBetweenOffsetCurvePoints() {
        const numOfLines = this.getCurve().getOffsetCurves()[0].getPoints().length;
        for (let i = 0; i < numOfLines; i++) {
            const offsetLine = this.board.create('line', [this.jxgOffsetControlPoints[i], this.jxgOffsetControlPoints[this.jxgOffsetControlPoints.length - numOfLines + i]], {
                straightFirst: false,
                straightLast: false,
                strokeWidth: () => SizeContext.strokeWidth,
                color: Colors[i]
            });
            this.jxgOffsetControlPointsLines.push(offsetLine);
        }
    }

    generateJsxOffsetCurves(hide?: boolean) {
        this.board.removeObject(this.jsxOffsetCurves);
        this.jsxOffsetCurves = [];
        this.jsxOffsetCurves = this.getCurve().getOffsetCurves().map(curve => this.board.create('curve',
            [(t: number) => {
                return curve.calculatePointAtT(t).X();
            },
                (t: number) => {
                    return curve.calculatePointAtT(t).Y();
                },
                0,
                1
            ], CurveStyles.default
        ));
        if (hide) {
            this.jsxOffsetCurves.forEach(curve => curve.hide());
        }
    }

    override getCurveCommands(): JSX.Element[] {
        return super.getCurveCommands().concat(...PhBezierCurveCommands(this));
    }

    override getCurve(): PhBezierCurve {
        return super.getCurve() as PhBezierCurve;
    }
}
