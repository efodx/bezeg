import BasePhBezierCurveGraph, {BasePhBezierCurveGraphStates} from "./BasePhBezierCurveGraph";
import {OnOffSwitch} from "../../inputs/OnOffSwitch";
import {PointStyles} from "../styles/PointStyles";
import {Color} from "../bezier/utilities/Colors";
import {SizeContext} from "../context/SizeContext";
import {SegmentStyles} from "../styles/SegmentStyles";

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
        this.getFirstJsxCurve().getJxgCurve().setAttribute({visible: () => this.state.showingCurve});
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

    private showControlyPolygonGeometry(checked: boolean) {
        this.setState({...this.state, showingCurve: !checked});
        this.getFirstJsxCurve().showControllPolygon(checked);
    }
}

export default CubicPhBezierCurveGraph;
