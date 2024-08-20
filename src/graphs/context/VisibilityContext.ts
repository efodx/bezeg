const dPointVisibility = true
const dTickNumbersVisibility = true
const dTicksVisibility = true
const dAxisVisibility = true
const dMinorVisibility = true

class VisibilityContextSingleton {
    pointVisibility = dPointVisibility

    setPointVisibility(visible: boolean) {
        this.pointVisibility = visible
    }

    pointsVisible() {
        return this.pointVisibility
    }

    reset() {
        this.pointVisibility = dPointVisibility
    }

    axisVisible() {
        console.log("AXIS VISIBLE")
        return true;
    }
}

export const VisibilityContext = new VisibilityContextSingleton()