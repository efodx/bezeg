export interface Point {
    X: () => number;
    Y: () => number;
    setX: (x: number | (() => number)) => void;
    setY: (y: number | (() => number)) => void;
    isYFunction: () => boolean;
    isXFunction: () => boolean

    // TODO add setters for x y functions, this way we can fix spline points with functions
}
