export interface Point {
    X: () => number;
    Y: () => number;
    setX: (x: number | (() => number)) => void;
    setY: (y: number | (() => number)) => void;
    isYFunction: () => boolean;
    isXFunction: () => boolean
}
