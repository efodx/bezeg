import '../../App.css';
import {BaseRationalCurveGraph} from "./BaseRationalCurveGraph";
import {Button} from "react-bootstrap";
import {BaseGraphProps, BaseGraphStates} from "../base/BaseCurveGraph";


class RationalBezierCurveGraph extends BaseRationalCurveGraph<BaseGraphProps, BaseGraphStates> {


    initialize() {
        const n = 3;
        this.generateCurves(n);
    }

    override getGraphCommands(): JSX.Element[] {
        return super.getGraphCommands().concat(<Button variant={"dark"}
                                                       onClick={() => this.setN(this.getAllJxgCurves().length + 1)}>Dodaj
            kos</Button>).concat(
            <Button variant={"dark"} onClick={() => this.setN(this.getAllJxgCurves().length - 1)}>Odstrani
                kos</Button>);
    }

    private generateCurves(n: number) {
        const r = 3;
        const alpha = Math.PI / n
        const R = r / Math.cos(alpha)
        const evenPoints = []
        const oddPoints = []
        for (let i = 0; i <= n; i++) {
            evenPoints.push([r * Math.sin(2 * i * alpha), -r * Math.cos(2 * i * alpha)])
            oddPoints.push([R * Math.sin((2 * i + 1) * alpha), -R * Math.cos((2 * i + 1) * alpha)])
        }
        // ZADEVA DELA TUDI ZA n=2, PRI ČEMER SO TE ŠITI TOČKE V NESKONČNOSTI!!!!!!!!
        // NEVERJETNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        for (let i = 0; i <= n - 1; i++) {
            const p1 = evenPoints[i]
            const p2 = oddPoints[i]
            const p3 = evenPoints[i + 1]
            const w = [1, Math.cos(alpha), 1]
            this.createRationalJSXBezierCurve([p1, p2, p3], w)

        }
    }

    private setN(n: number) {
        if (n < 2) {
            return
        }
        this.board.suspendUpdate()
        // @ts-ignore
        this.board.removeObject(this.getAllJxgCurves().concat(this.getAllJxgPoints()))
        this.jsxBezierCurves = []
        this.generateCurves(n)
        this.board.unsuspendUpdate()
    }
}

export default RationalBezierCurveGraph;
