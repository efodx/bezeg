interface JGBoxProps {
    onResize: (width: number, height: number) => void
}

export function JGBox() {
    return <div id="jgbox" style={{
        width: "100%",
        height: "80vh",
        background: "white",
        borderRadius: "5px"
    }}/>
}
