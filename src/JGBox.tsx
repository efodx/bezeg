import {ResizableBox} from "react-resizable"

interface JGBoxProps {
    onResize: (width: number, height: number) => void
}

export function JGBox({onResize}: JGBoxProps) {
    // let height = document.documentElement.clientHeight * 0.65;
    // let width = document.documentElement.clientWidth * 0.65;
    return <ResizableBox width={900} height={600} minConstraints={[100, 100]} maxConstraints={[3000, 1200]}
                         onResize={(event, {node, size, handle}) => onResize(size.width, size.height)} style={{
        marginTop: "2vh",
        marginBottom: "2vh", marginInline: "2vh"
    }}>
        <div id="jgbox" style={{
            width: "100%",
            height: "100%",
            background: "white"
        }}/>
    </ResizableBox>
}
