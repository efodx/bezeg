import {ResizableBox} from "react-resizable"

interface JGBoxProps {
    onResize: (width: number, height: number) => void
}

export function JGBox({onResize}: JGBoxProps) {
    return <ResizableBox width={400} height={400} minConstraints={[100, 100]} maxConstraints={[1400, 1400]}
                         onResize={(event, {node, size, handle}) => onResize(size.width, size.height)} style={{
        marginTop: "2vh",
        marginBottom: "2vh", marginInline: "2vh"
    }}>
        <div id="jgbox" style={{
            width: "100%",
            height: "100%",
            background: "white"
            // marginTop: "2vh",
            // marginBottom: "2vh",
            // borderRadius: "10px"
        }}/>
    </ResizableBox>
}
