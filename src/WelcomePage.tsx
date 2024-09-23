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
        <p style={{color: "white"}} className="lead">
            Bezeg je spletno orodje za grafični prikaz lastnosti Bezierjevih in PH krivulj.
            <br></br>
            V okviru magistrskega dela sem ga izdelal <a
            href={"https://www.linkedin.com/in/kevin-%C5%A1tampar-6184171a5/"}>Kevin
            Štampar</a>, z nekaj usmeritvami mentorja <a
            href={"https://www.fmf.uni-lj.si/en/directory/263/zagar-emil/"}>Prof. Dr. Emila Žagarja</a>.

            <br></br>
            {/*𓆣 Hrošče lahko prijavite na repozitoriju projekta. 𓆣*/}
        </p>
        <hr className="my-4"></hr>
    </div>;
}