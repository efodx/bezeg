import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {BaseGraphStates} from "../../base/BaseCurveGraph";
import {CountSetter} from "../../../inputs/CountSetter";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<any, BaseGraphStates> {
    defaultPreset(): any {
        return [];
    }

    override initialize() {
        const n = 3;
        this.generateCurves(n);
        this.boardUpdate();
    }

    override getGraphCommands(): JSX.Element[] {
        return this.state.initialized ? super.getGraphCommands().concat(
            <div>
                <div>
                    Število krivulj
                </div>
                <CountSetter onPlus={() => this.setN(this.getAllJxgCurves().length + 1)} onCenter={() => 1}
                             n={this.getAllJxgCurves().length}
                             onMinus={() => this.setN(this.getAllJxgCurves().length - 1)}
                             min={2}></CountSetter></div>
        ) : [];
    }

    private generateCurves(n: number) {
        const r = 3;
        const alpha = Math.PI / n;
        const R = r / Math.cos(alpha);
        const evenPoints = [];
        const oddPoints = [];
        for (let i = 0; i <= n; i++) {
            evenPoints.push([r * Math.sin(2 * i * alpha), -r * Math.cos(2 * i * alpha)]);
            oddPoints.push([R * Math.sin((2 * i + 1) * alpha), -R * Math.cos((2 * i + 1) * alpha)]);
        }
        // ZADEVA DELA TUDI ZA n=2, PRI ČEMER SO TE ŠITI TOČKE V NESKONČNOSTI!!!!!!!!
        // NEVERJETNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        for (let i = 0; i <= n - 1; i++) {
            const p1 = evenPoints[i];
            const p2 = oddPoints[i];
            const p3 = evenPoints[i + 1];
            const w = [1, Math.cos(alpha), 1];
            this.createRationalJSXBezierCurve([p1, p2, p3], w);
        }
        this.boardUpdate();
    }

    private setN(n: number) {
        if (n < 2) {
            return;
        }
        this.board.suspendUpdate();
        // @ts-ignore
        this.board.removeObject(this.getAllJxgCurves().concat(this.getAllJxgPoints()));
        this.jxgCurves = [];
        this.generateCurves(n);
        this.board.unsuspendUpdate();
    }
}

export default RationalBezierCurveGraph;
