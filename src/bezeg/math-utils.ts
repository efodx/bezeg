export function rotationMatrix2D(theta: number) {
    return [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]
}