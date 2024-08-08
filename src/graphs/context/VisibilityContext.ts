const dPointVisibility = true
const dTickNumbersVisibility = true
const dTicksVisibility = true
const dAxisVisibility = true

class VisibilityContextSingleton {
    pointVisibility = dPointVisibility
    tickNumbersVisibility = dTickNumbersVisibility
    ticksVisibility = dTicksVisibility
    axisVisibility = dAxisVisibility;

    setPointVisibility(visible: boolean) {
        this.pointVisibility = visible
    }

    setTicksVisibility(visible: boolean) {
        this.ticksVisibility = visible
    }

    setTickNumberVisibility(visible: boolean) {
        this.tickNumbersVisibility = visible
    }

    ticksVisible() {
        return this.axisVisibility && this.ticksVisibility
    }

    pointsVisible() {
        return this.pointVisibility
    }

    tickNumbersVisible() {
        return this.axisVisibility && this.ticksVisibility && this.tickNumbersVisibility
    }

    reset() {
        this.pointVisibility = dPointVisibility
    }

    axisVisible() {
        return this.axisVisibility
    }

    setAxisVisible(visible: boolean) {
        this.axisVisibility = visible
    }

}

export const VisibilityContext = new VisibilityContextSingleton()