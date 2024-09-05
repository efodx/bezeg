import {JXGRationalBezierCurve} from "././JXGRationalBezierCurve";
import {JXGPHBezierCurve} from "./JXGPHBezierCurve";
import {JXGBezierCurve} from "./JXGBezierCurve";
import {Board} from "jsxgraph";
import {JXGGenericSplineCurve} from "./JXGGenericSplineCurve";
import {JXGQuadraticC1SplineCurve} from "./JXGQuadraticC1SplineCurve";
import {JXGQubicC2SplineCurve} from "./JXGQubicC2SplineCurve";
import {JXGQuadraticG1SplineCurve} from "./JXGQuadraticG1SplineCurve";
import {JXGSymmetricQuadraticG1SplineCurve} from "./JXGSymmetricQuadraticG1SplineCurve";

const nameToClassMap = new Map([
    ["JSXRationalBezierCurve", JXGRationalBezierCurve as any],
    ["JSXGenericSplineCurve", JXGGenericSplineCurve],
    ["JSXQuadraticC1SplineCurve", JXGQuadraticC1SplineCurve],
    ["JSXQubicC2SplineCurve", JXGQubicC2SplineCurve],
    ["JSXQuadraticG1SplineCurve", JXGQuadraticG1SplineCurve],
    ["JSXBezierCurve", JXGBezierCurve],
    ["JSXPHBezierCurve", JXGPHBezierCurve],
    ["JSXSymmetricQuadraticG1SplineCurve", JXGSymmetricQuadraticG1SplineCurve]
]);

const classToNameMap = new Map<any, string>(
    Array.from(nameToClassMap.entries()).map((e => [e[1], e[0] as any])));


export class ClassMapper {
    static getFromDto(name: string): (s: any, board: Board) => any {
        return nameToClassMap.get(name).fromDto;
    }

    static getClassName(clazz: any): string {
        return classToNameMap.get(clazz)!;
    }

    static getToDto(clazz: any): (curve: any) => any {
        return clazz.toDto;
    }

}