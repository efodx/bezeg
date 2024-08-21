export enum AxisSelect {
    NONE = "Brez",
    ONLY_AXIS = "Samo osi",
    AXIS_AND_MAJOR = "Osi in mreža",
    AXIS_AND_MINOR = "Osi in mreža in črtice",
    EVERYTHING = "Vse"
}

class AxisContextSingleton {
    axisSelect = AxisSelect.EVERYTHING;
    ticksNumbersVisibility = [AxisSelect.EVERYTHING];
    ticksMinorVisibility = [AxisSelect.AXIS_AND_MINOR, AxisSelect.EVERYTHING];
    ticksVisibility = [AxisSelect.AXIS_AND_MAJOR, AxisSelect.AXIS_AND_MINOR, AxisSelect.EVERYTHING];
    axisVisibility = [AxisSelect.ONLY_AXIS, AxisSelect.AXIS_AND_MAJOR, AxisSelect.AXIS_AND_MINOR, AxisSelect.EVERYTHING];

    ticksVisible() {
        return this.ticksVisibility.includes(this.axisSelect);
    }


    tickNumbersVisible() {
        return this.ticksNumbersVisibility.includes(this.axisSelect);
    }

    axisVisible() {
        return this.axisVisibility.includes(this.axisSelect);
    }


    minorVisible() {
        return this.ticksMinorVisibility.includes(this.axisSelect);
    }

    getSelected() {
        return this.axisSelect;
    }

    setSelected(selected: AxisSelect) {
        this.axisSelect = selected;
    }
}

export const AxisContext = new AxisContextSingleton();