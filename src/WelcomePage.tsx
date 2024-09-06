import React, {useContext} from "react";
import Logo from "./images/elderflower.png";
import {SiteContext} from "./graphs/context/react/SiteContext";

export function WelcomePage() {
    const fsContext = useContext(SiteContext).fullScreen;
    fsContext.setFullScreen(false);
    return <div>
        <h1 style={{color: "white"}} className="display-4">
            Dobrodošel na Bezgu!
            <img src={Logo} width="30" height="30" alt=""></img></h1>
        <p style={{color: "white"}} className="lead">Bezeg je javascript knjižnica za delo z bezierjevimi krivuljami.
            Spletna stran Bezga pa služi predstavitvi raznih konceptov vezanih na Bezierjeve krivulje.</p>
        <hr className="my-4"></hr>
    </div>;
}