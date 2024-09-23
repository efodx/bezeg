import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";
import {Color} from "../bezier/utilities/Colors";
import {PointStyles} from "../../styles/PointStyles";
import {SizeContext} from "../../context/SizeContext";
import {SegmentStyles} from "../../styles/SegmentStyles";
import {OnOffSwitch} from "../../../inputs/OnOffSwitch";

interface CubicPhBezierCurveGraphStates extends BasePhBezierCurveGraphStates {
    showingCurve: boolean
}

class CubicPhBezierCurveGraph extends BasePhBezierCurveGraph<any, CubicPhBezierCurveGraphStates> {
    override componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<CubicPhBezierCurveGraphStates>, snapshot?: any) {
        this.boardUpdate();
    }

    override getInitialState(): CubicPhBezierCurveGraphStates {
        return {...super.getInitialState(), showingCurve: true};
    }

    override initialize() {
        super.initialize();
        this.getFirstJxgCurve().getJxgCurve().setAttribute({visible: () => this.state.showingCurve});
        const points = this.getAllJxgPoints();

        const label = {...PointStyles.default.label};

        // @ts-ignore
        label!.visible = () => false;
        let attr = {
            radius: () => SizeContext.strokeWidth / 8,
            color: Color.MAGENTA,
            label: label,
            name: "$$\\theta_1$$",
            visible: () => !this.state.showingCurve
        };

        const angle1 = this.board.create('angle', [points[0], points[1], points[2]], attr);
        const angle2 = this.board.create('angle', [points[1], points[2], points[3]], attr);
        let textattr = {
            useMathJax: true,
            fontSize: () => SizeContext.fontSize * 0.7,
            label: label,
            name: "$$\\theta_1$$",
            visible: () => !this.state.showingCurve
        };
        this.createLLabel(points, 0);
        this.createLLabel(points, 1);
        this.createLLabel(points, 2);
        const segment1 = this.board.create('segment', [points[0], points[2]], {
            ...SegmentStyles.default,
            visible: () => !this.state.showingCurve
        });
        const segment2 = this.board.create('segment', [points[1], points[3]], {
            ...SegmentStyles.default,
            visible: () => !this.state.showingCurve
        });

        const s = this.board.create('polygon', [points[1], points[2], points[3]], {
            ...SegmentStyles.default,
            visible: () => !this.state.showingCurve
        });
        const s2 = this.board.create('polygon', [points[0], points[1], points[2]], {
            ...SegmentStyles.default,
            visible: () => !this.state.showingCurve
        });
    }

    defaultPreset(): any {
        return [["JSXPHBezierCurve", {
            "points": [[0, 0]], "hodographs": [[-3, 2], [2, 2]], "state": {
                "showingJxgPoints": true,
                "showingControlPolygon": false,
                "showingConvexHull": false,
                "showingDecasteljauScheme": false,
                "subdivisionT": 0.5,
                "decasteljauT": 0.5,
                "extrapolationT": 1.2,
                "showOffsetCurveControlPoints": false,
                "showOffsetCurve": false
            }
        }]];
    }

    override presets(): string | undefined {
        return "cubic-ph";
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat([<OnOffSwitch initialState={!this.state.showingCurve}
                                                             key={"polygon-geometry"}
                                                             onChange={(checked) => this.showControlyPolygonGeometry(checked)}
                                                             label={"Geometrija kontrolnega poligona"}></OnOffSwitch>]);
    }

    private createLLabel(points: JXG.Point[], i: number) {
        let textattr = {
            useMathJax: true,
            fontSize: () => SizeContext.fontSize,
            visible: () => !this.state.showingCurve
        };

        var text = this.board.create('text',
            [() => {
                var dx = (points[i].X() - points[i + 1].X());
                var dy = (points[i].Y() - points[i + 1].Y());
                var spd = Math.sqrt(dx ** 2 + dy ** 2);
                spd = spd * 1.8;//popravek
                dy = dy / spd;
                dy = dy * SizeContext.fontSize * 0.022;
                if (dx < 0) {
                    dy -= SizeContext.fontSize * 0.01;
                }
                //dy += dy / Math.abs(dy) * SizeContext.fontSize * 0.01;
                return (points[i].X() + points[i + 1].X()) / 2 + dy;
            }, () => {
                var dx = (points[i].X() - points[i + 1].X());
                var dy = (points[i].Y() - points[i + 1].Y());
                var spd = Math.sqrt(dx ** 2 + dy ** 2);
                spd = spd * 1.8;//popravek
                dx = dx / spd;
                dx = dx * SizeContext.fontSize * 0.022;
                //dx += dx / Math.abs(dx) * SizeContext.fontSize * 0.01;
                return (points[i].Y() + points[i + 1].Y()) / 2 - dx;
            },
                () => "$$L_" + (i + 1) + "$$"
            ],
            textattr
        );
    }

    private showControlyPolygonGeometry(checked: boolean) {
        this.setState({...this.state, showingCurve: !checked});
        this.getFirstJxgCurve().showControllPolygon(checked);
    }
}

export default CubicPhBezierCurveGraph;
