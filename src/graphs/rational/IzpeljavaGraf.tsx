import BaseGraph from "../base/BaseGraph";
import {PointStyles} from "../styles/PointStyles";
import {SizeContext} from "../context/SizeContext";
import {SegmentStyles} from "../styles/SegmentStyles";
import {Color} from "../bezier/utilities/Colors";

function withName(name: string) {
    return {...PointStyles.default, name: name}
}

function withColor(color: string) {
    return {...SegmentStyles.default, color: color}
}

function withRadius(r: number) {
    const label = PointStyles.default.label
    label!.anchorY = "auto";
    label!.anchorX = "auto";
    return {radius: r, color: Color.MAGENTA, label: label, name: "$$a$$"}
}

export class IzpeljavaGraf extends BaseGraph<any, any> {


    defaultPreset(): string {
        return "";
    }

    initialize(): void {
        const r = 1
        const x = 0.4
        const s = -0.75
        const S = this.board.create('point', [0, s], withName("$$S$$"))
        const p0 = this.board.create('point', [() => Math.sqrt(r ** 2 - S.Y() ** 2), 0], withName("$$p_0$$"))
        const p1 = this.board.create('point', [0, 1], withName("$$p_1$$"))
        const p2 = this.board.create('point', [() => -Math.sqrt(r ** 2 - S.Y() ** 2), 0], withName("$$p_2$$"))
        const O = this.board.create('point', [() => 0, () => 0], withName("$$O$$"))
        const X = this.board.create('point', [() => 0, () => 1 + S.Y()], withName("$$T$$"))

        const circle = this.board.create('circle', [S, 1], {
            strokeWidth: () => SizeContext.strokeWidth
        })


        const segment = this.board.create('segment', [S, p1], withColor(Color.LIGHT_GREEN))
        const segment2 = this.board.create('segment', [S, p2], withColor(Color.LIGHT_GREEN))
        const segment3 = this.board.create('segment', [S, p0], withColor(Color.LIGHT_GREEN))
        const segment4 = this.board.create('segment', [p2, p1], withColor(Color.LIGHT_GREEN))
        const segment5 = this.board.create('segment', [p0, p1], withColor(Color.LIGHT_GREEN))
        const segment6 = this.board.create('segment', [p2, p0], withColor(Color.LIGHT_GREEN))

        const angle1 = this.board.create('angle', [O, p0, S], withRadius(0.4))
        const angle2 = this.board.create('angle', [O, p1, p0], withRadius(0.4))

        this.board.on('move', () => {
            S.moveTo([0, S.Y()])
            // @ts-ignore
            const alpha = angle1.Value('radian')
            p1.moveTo([0, r * (1 - Math.pow(Math.sin(alpha), 2)) / Math.sin(alpha)])
        })

    }

    override presets(): string | undefined {
        return "izpeljava-graf";
    }
}