import {JSXRationalBezierCurve} from "./JSXRationalBezierCurve";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";
import {JSXBezierCurve} from "./JSXBezierCurve";
import {Board} from "jsxgraph";
import {JSXGenericSplineCurve} from "./JSXGenericSplineCurve";
import {JSXQuadraticC1SplineCurve} from "./JSXQuadraticC1SplineCurve";
import {JSXQubicC2SplineCurve} from "./JSXQubicC2SplineCurve";
import {JSXQuadraticG1SplineCurve} from "./JSXQuadraticG1SplineCurve";
import {JSXSymmetricQuadraticG1SplineCurve} from "./JSXSymmetricQuadraticG1SplineCurve";

const nameToClassMap = new Map([
    ["JSXRationalBezierCurve", JSXRationalBezierCurve as any],
    ["JSXGenericSplineCurve", JSXGenericSplineCurve],
    ["JSXQuadraticC1SplineCurve", JSXQuadraticC1SplineCurve],
    ["JSXQubicC2SplineCurve", JSXQubicC2SplineCurve],
    ["JSXQuadraticG1SplineCurve", JSXQuadraticG1SplineCurve],
    ["JSXBezierCurve", JSXBezierCurve],
    ["JSXPHBezierCurve", JSXPHBezierCurve],
    ["JSXSymmetricQuadraticG1SplineCurve", JSXSymmetricQuadraticG1SplineCurve]
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