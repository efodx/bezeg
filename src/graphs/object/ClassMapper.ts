import {JSXSplineCurve} from "./JSXSplineCurve";
import {JSXRationalBezierCurve} from "./JSXRationalBezierCurve";
import {JSXPHBezierCurve} from "./JSXPHBezierCurve";
import {JSXBezierCurve} from "./JSXBezierCurve";
import {Board} from "jsxgraph";

const nameToClassMap = new Map([
    ["JSXRationalBezierCurve", JSXRationalBezierCurve as any],
    ["JSXSplineCurve", JSXSplineCurve],
    ["JSXBezierCurve", JSXBezierCurve],
    ["JSXPHBezierCurve", JSXPHBezierCurve]
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