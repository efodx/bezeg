import React, {ReactNode} from 'react';
import './App.css';
import {Link, Outlet, NavLink} from "react-router-dom";
import routes from "./Routes";
import Logo from "./images/elderflower.png"

function NavBar() {
    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" style={{marginLeft: "1vw"}} to="/bezeg">
            <img src={Logo} width="30" height="30" alt=""/>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">

                {routes.flatMap((mainEntry) => mainEntry.children)
                    .filter((child) => !child.index)
                    .map((child) => { // @ts-ignore
                        return <li className="nav-item">
                            <NavLink className="nav-link" to={child.path}>{child.title}</NavLink>
                        </li>
                    })
                }
            </ul>
        </div>
    </nav>
}

function Main(props: { children: ReactNode }) {
    return <div style={{
        display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center"
    }}>{props.children}</div>
}

function App() {
    return (
        <div className="App" style={{height: "100vh"}}>
            <NavBar/>
            <Main>
                <Outlet/>
            </Main>
        </div>
    );
}

export default App;
