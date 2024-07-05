const dFontSize = 2
const dStrokeWidth = 0.5
const dPointSize = 1
const dMajorHeight = 5
const dMinorHeight = 3

const defaultFontSize = 20
const defaultStrokeWidth = 2
const defaultPointSize = 4
const defaultMajorHeight = 10
const defaultMinorHeight = 4


class SizeContextSingleton {
    fontSize = defaultFontSize
    strokeWidth = defaultStrokeWidth
    pointSize = defaultPointSize
    majorHeight = defaultMajorHeight
    minorHeight = defaultMinorHeight

    private size = 0

    setSize(i: number) {
        this.size = i
        this.calculateSizes()
    }

    getSize() {
        return this.size
    }

    reset() {
        this.setSize(0)
    }

    private calculateSizes() {
        this.fontSize = defaultFontSize + this.size * dFontSize
        this.strokeWidth = defaultStrokeWidth + this.size * dStrokeWidth
        this.pointSize = defaultPointSize + this.size * dPointSize
        this.majorHeight = defaultMajorHeight + this.size * dMajorHeight
        this.minorHeight = defaultMinorHeight + this.size * dMinorHeight
    }

}

export const SizeContext = new SizeContextSingleton()