/**
 * Class that wraps a BezierCurve with methods for dealing with JSXGraph
 */
import {JSXBezierCurveConstructorParams, JXGBezierCurve, JXGBezierCurveState} from "./JXGBezierCurve";
import {Board} from "jsxgraph";
import {BezierCurveAttributes} from "./AbstractJXGBezierCurve";
import {Color, Colors} from "../bezier/utilities/Colors";
import {PhBezierCurveCommands} from "./inputs/PhBezierCurveCommands";
import {PhBezierCurve} from "../../../bezeg/impl/curve/ph-bezier-curve";
import {Attributes} from "../../attributes/Attributes";
import {CacheContext} from "../../context/CacheContext";
import {PointStyles} from "../../styles/PointStyles";
import {BezierCurve} from "../../../bezeg/api/curve/bezier-curve";
import {PointImpl} from "../../../bezeg/impl/point/point-impl";
import {SizeContext} from "../../context/SizeContext";
import {CurveStyles} from "../../styles/CurveStyles";
import {Point} from "../../../bezeg/api/point/point";
import {JXGPointWrapper as PointWrapper} from "./JXGPointWrapper";

interface JSXPHBezierCurveConstructorParams extends JSXBezierCurveConstructorParams {
    hodographs: number[][],
    state: JSXPHBezierCurveState
}

interface JSXPHBezierCurveState extends JXGBezierCurveState {
    showOffsetCurve: boolean;
    showOffsetCurveControlPoints: boolean;
    showOffsetCurveControlPointsLines: boolean;
    offsetCurveNumber: number;
    d: number
}

// TODO this one shouldn't extend JXGBezierCurve... but we needed it cause we don't have an interface for the JXG curves..
export class JXGPHBezierCurve extends JXGBezierCurve {

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

    static override toDto(curve: JXGBezierCurve): any {
        return {
            points: [curve.pointControlledCurve.getPoints().map(point => [point.X(), point.Y()])[0]],
            hodographs: (curve.getCurve() as PhBezierCurve).w.map(point => [point.X(), point.Y()]),
            state: curve.exportState()
        } as JSXPHBezierCurveConstructorParams;
    }

    static override fromDto(params: JSXPHBezierCurveConstructorParams, board: Board): JXGBezierCurve {
        const curve = new JXGPHBezierCurve(params.points.concat(params.hodographs), board);
        if (params.state) {
            curve.importState(params.state);
        }
        return curve as JXGBezierCurve;
    }

    override importState(state: JSXPHBezierCurveState) {
        super.importState(state);
        if (state.d) {
            this.getCurve().setOffsetCurveDistance(state.d);
        }
        this.setOffsetCurveNumber(state.offsetCurveNumber);
        this.generateJsxOffsetCurves(!state.showOffsetCurve);
        this.setShowOffsetCurve(state.showOffsetCurve);
        this.setShowOffsetCurveControlPoints(state.showOffsetCurveControlPoints);
        this.setShowOffsetCurveControlPointsLines(state.showOffsetCurveControlPointsLines);
    }

    override exportState(): JSXPHBezierCurveState {
        return {
            ...super.exportState(),
            showOffsetCurveControlPoints: this.showOffsetCurveControlPoints,
            showOffsetCurveControlPointsLines: this.showOffsetCurveControlPointsLines,
            showOffsetCurve: this.showOffsetCurve,
            offsetCurveNumber: this.getCurve().getOffsetCurves().length,
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

    override getInitialCurve(points: number[][]): BezierCurve {
        const pointsImpl = points.map(p => new PointImpl(p[0], p[1]));
        const curve = new PhBezierCurve(pointsImpl.slice(0, 1), pointsImpl.slice(1));
        curve.getPoints().map((p, i) => this.createJSXGraphPoint(() => p.X(), () => p.Y(), PointStyles.pi(i, () => this.isShowingJxgPoints())));
        return curve;
    }

    setOffsetCurveNumber(num: number) {
        this.getCurve().setOffsetCurveNumber(num);
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

    getNumberOfOffsetCurves() {
        return this.getCurve().getOffsetCurves().length;
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
                return curve.eval(t).X();
            },
                (t: number) => {
                    return curve.eval(t).Y();
                },
                0,
                1
            ], {...CurveStyles.default, strokeColor: Color.R}
        ));
        if (hide) {
            this.jsxOffsetCurves.forEach(curve => curve.hide());
        }
    }

    override startResizing() {
        super.startResizing();
    }

    override resize(newCoords: JXG.Coords) {
        let [minX, maxX, minY, maxY] = this.pointControlledCurve.getBoundingBox();
        let [cX, cY] = this.pointControlledCurve.getBoundingBoxCenter();
        let [dx, dy] = [newCoords.usrCoords[1] - this.coords!.usrCoords[1], newCoords.usrCoords[2] - this.coords!.usrCoords[2]];
        let [xDir, yDir] = this.getResizingDir();
        dy = yDir * dy;
        dx = xDir * dx;
        let xScale = (2 * dx + maxX - minX) / (maxX - minX);
        let yScale = (2 * dy + maxY - minY) / (maxY - minY);
        let [minXb, maxYb, maxXb, minYb] = this.board.getBoundingBox();
        const howSmallX = (maxX - minX) / (maxXb - minXb);
        const howSmallY = (maxY - minY) / (maxYb - minYb);
        let [x, y] = [newCoords.usrCoords[1], newCoords.usrCoords[2]];
        let center = new PointImpl(cX, cY);
        let resizingPoint = new PointWrapper(this.resizingStart!);
        let userCoords = new PointImpl(x, y);
        if (((xDir * yDir === 1) && !this.isPointOnLeft(center, resizingPoint, userCoords)) || ((xDir * yDir === -1) && this.isPointOnLeft(center, resizingPoint, userCoords))) {
            if ((xScale * howSmallX < 0.01 || xScale * howSmallY < 0.01)) {
                return;
            }
            this.pointControlledCurve.scale(xScale);
        } else {
            if ((yScale * howSmallX < 0.01 || yScale * howSmallY < 0.01)) {
                return;
            }
            this.pointControlledCurve.scale(yScale);
        }


    }

    override getCurveCommands(): JSX.Element[] {
        return super.getCurveCommands().concat(...PhBezierCurveCommands(this));
    }

    override getCurve(): PhBezierCurve {
        return super.getCurve() as PhBezierCurve;
    }

    override getResizingDir(): number[] {
        // @ts-ignore
        if (this.boundBoxPoints[0] === this.resizingStart) {
            return [-1, -1];
        }
        // @ts-ignore
        if (this.boundBoxPoints[1] === this.resizingStart) {
            return [-1, 1];
        }
        // @ts-ignore
        if (this.boundBoxPoints[2] === this.resizingStart) {
            return [1, 1];
        }
        return [1, -1];
    }

    private isPointOnLeft(current: Point, point: Point, p: Point) {
        return ((p.X() - current.X()) * (point.Y() - current.Y()) - (p.Y() - current.Y()) * (point.X() - current.X())) <= 0;
    }
}
