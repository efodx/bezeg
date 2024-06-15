import {JSXGraph} from "jsxgraph";
import {useEffect} from "react";

interface HodographInputBoxProps {
    setRef: (arg0: JXG.Board) => void
}

export function HodographInputbox(props: HodographInputBoxProps) {
    useEffect(() => {
        const board = JSXGraph.initBoard("hodograph-input-box", {
            showFullscreen: false, boundingbox: [-5, 5, 5, -5], axis: true, showNavigation: false, showCopyright: false
        })
        props.setRef(board)
    })

    return <div id="hodograph-input-box" style={{
        width: "100%",
        aspectRatio: 1 / 1,
        background: "white",
        marginTop: "2vh",
        marginBottom: "2vh",
        borderRadius: "10px"
    }}/>
}
