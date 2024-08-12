import {useContext} from "react";
import {SiteContext} from "./graphs/context/react/SiteContext";

export function JGBox() {
    const fullScreen = useContext(SiteContext).fullScreen.fullScreen
    return <div id="jgbox" style={{
        width: "100%",
        height: fullScreen ? "100vh" : "80vh",
        background: "white",
        borderRadius: fullScreen ? 0 : "5px"
    }}/>
}
