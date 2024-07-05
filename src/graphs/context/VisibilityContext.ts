const dPointVisibility = true


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

}

export const VisibilityContext = new VisibilityContextSingleton()