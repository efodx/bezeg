import React, {Component} from 'react';
import '../App.css';

import {Board, JSXGraph} from "jsxgraph";
import {BezierCurve} from "../bezeg/bezier-curve";
import {Point} from "./Point";

class Graph extends Component<any, any> {
    private board: Board | undefined;
    private points: unknown[] | undefined;

    componentDidMount() {
        this.board = JSXGraph.initBoard("jgbox", {boundingbox: [-5, 5, 5, -5], axis: true});
        const p = this.board.create('point', [-3, 2]);
        const pp = new Point(p);
        const p2 = this.board.create('point', [0, -2]);
        const pp2 = new Point(p2);
        const p3 = this.board.create('point', [1,2]);
        const pp3 = new Point(p3);
        const p4 = this.board.create('point', [3,-2 ]);
        const pp4 = new Point(p4);
        this.points = [p,p2,p3,p4]
        const bejzjer = new BezierCurve([pp,pp2,pp3,pp4])

        const curve = this.board.create('curve',
            [function (t: number) {
                return bejzjer.calculatePointAtT(t).X();
            },
                function (t: number) {
                    return bejzjer.calculatePointAtT(t).Y();
                },
                0, 1]
        );
        this.board.on('down',(e) => this.handleDown(e));

    }

    render() {
        return <div id="jgbox" style={{width: 500, height: 500, background: "white"}}></div>;
    }



     getMouseCoords(e: unknown, i: number | undefined) {

        // @ts-ignore
         const pos = this.board.getMousePosition(e, i);

         return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, this.board as Board);

    }



    handleDown (e: unknown) {

        let canCreate = true,

            i, coords: JXG.Coords, el;

        coords = this.getMouseCoords(e, i);



        // @ts-ignore
        for (el in this.board.objects) {

            // @ts-ignore
            if (JXG.isPoint(this.board.objects[el]) && this.board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {

                canCreate = false;

                break;

            }

        }



        if (canCreate) {

            // @ts-ignore
        //    this.board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
            this.board?.objectsList.forEach(p => {if( this.points?.includes(p)) {
                // @ts-ignore
                this.board?.removeObject(p)
            }
            })
        } else{
            // @ts-ignore
            this.board?.objectsList.forEach(p => {if( this.points?.includes(p)) {
                // @ts-ignore
                this.board?.removeObject(p)
            }
            })
        }

    };




}

export default Graph;
