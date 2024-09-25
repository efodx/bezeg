import React, {useContext} from "react";
import Logo from "./images/elderflower.png";
import {SiteContext} from "./graphs/context/react/SiteContext";

export function WelcomePage() {
    const fsContext = useContext(SiteContext).fullScreen;
    fsContext.setFullScreen(false);
    return <div>
        <h1 style={{color: "white"}} className="display-4">
            Dobrodošli na Bezgu!
            <img src={Logo} width="30" height="30" alt=""></img></h1>
        <p style={{color: "white"}} className="lead">
            Bezeg je spletno orodje za grafični prikaz lastnosti Bezierjevih in PH krivulj.
            <br></br>
            V okviru magistrskega dela sem ga izdelal Kevin
            Štampar, z nekaj usmeritvami mentorja Prof. Dr. Emila Žagarja.
            <br></br>
        </p>
        <span style={{color: "white"}} className="lead"><small>𓆣 Predloge za izboljšavo orodja oziroma najdene hrošče lahko pošljete na email clovek.kevin@gmail.com. 𓆣</small></span>
        <hr className="my-4"></hr>
    </div>;
}