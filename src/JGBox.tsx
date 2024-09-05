import {useContext} from "react";
import {SiteContext} from "./graphs/context/react/SiteContext";

export function JGBox() {
    const fullScreen = useContext(SiteContext).fullScreen.fullScreen;
    let width, height;
    // use this for creating the magistrska grafix
    let hait = 1000;
    let wif = 1.414 * hait;
    width = `${wif}px`;
    height = `${hait}px`;


    width = "100%";
    height = "85vh";
    return <div id="jgbox" style={{
        width: width,
        height: fullScreen ? "100vh" : height,
        background: "white",
        borderRadius: fullScreen ? 0 : "5px"
    }}/>;
}
