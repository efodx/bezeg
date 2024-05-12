import React, {ReactNode} from 'react';
import './App.css';
import {Link, NavLink, Outlet} from "react-router-dom";
import routes from "./Routes";
import Logo from "./images/elderflower.png"


function NavBar() {
    let normalChildren = routes.flatMap((mainEntry) => mainEntry.children)
        .filter((child) => !child.index && !child.group)
    let groupedChildren = {}
    let children = routes.flatMap((mainEntry) => mainEntry.children)
        .filter(child => !child.index)
        .flatMap(child => {
            if (child.group) {
                // @ts-ignore
                if (groupedChildren[child.group]) {
                    // @ts-ignore
                    groupedChildren[child.group].push(child)
                } else {
                    // @ts-ignore
                    groupedChildren[child.group] = [child]
                    return child.group!
                }
            } else {
                return child!
            }
        })
        .filter(child => typeof child != "undefined")
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
                {children
                    .map((child) => {
                        // We got the group key, so we take children from the group
                        if (typeof child == "string") {
                            return <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                   aria-expanded="false">
                                    {child}
                                </a>
                                <ul className="dropdown-menu">
                                    {   // @ts-ignore
                                        groupedChildren[child].map(child => <NavLink className="nav-link dropdown-item"
                                                                                     to={child.path}>{child.title}</NavLink>
                                        )}
                                </ul>
                            </li>
                        } else {
                            return <li className="nav-item">
                                <NavLink className="nav-link" to={child!.path}>{child!.title}</NavLink>
                            </li>
                        }

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