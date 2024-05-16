import {JSXGraph} from "jsxgraph";
import {useEffect} from "react";

interface HodographInputBoxProps {
    setRef: (arg0: JXG.Board) => void
}

export function HodographInputbox(props: HodographInputBoxProps) {
    useEffect(() => {
        const board = JSXGraph.initBoard("hodograph-input-box", {
            showFullscreen: true, boundingbox: [-5, 5, 5, -5], axis: true
        })
        props.setRef(board)
    }, [])

    return <div id="hodograph-input-box" style={{
        width: "20vh",
        height: "20vh",
        background: "white",
        marginTop: "2vh",
        marginBottom: "2vh",
        borderRadius: "10px"
    }}/>
}
