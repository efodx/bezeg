import React, {useContext, useState} from 'react';
import './App.css';
import {NavLink, Outlet, useLocation} from "react-router-dom";
import routes from "./Routes";
import Logo from "./images/elderflower.png"
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {SiteContext} from "./graphs/context/react/SiteContext";

function NavBar() {
    const location = useLocation();
    const fullScreenContext = useContext(SiteContext).fullScreen
    let groupedChildren = {}
    let groupByTitle = {}
    let children = routes.flatMap((mainEntry) => mainEntry.children)
        .filter(child => !child.index)
        .flatMap(child => {
            if (child.group) {
                // @ts-ignore
                if (groupedChildren[child.group.title]) {
                    // @ts-ignore
                    groupedChildren[child.group.title].push(child)
                } else {
                    // @ts-ignore
                    groupedChildren[child.group.title] = [child]
                    // @ts-ignore
                    groupByTitle[child.group.title] = child.group
                    return child.group.title
                }
                return []
            } else {
                return child!
            }
        })
        .filter(child => typeof child != "undefined")
    console.log(fullScreenContext)
    return <Navbar expand="xl" className={`bg-body-tertiary  ${fullScreenContext.fullScreen ? "navbar-fs" : ""}`}>
        <Container className={"w-100"}>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto">
                    <LinkContainer to="/bezeg">
                        <Navbar.Brand style={{marginLeft: "1vw"}}>
                            <img src={Logo} width="30" height="30" alt=""/>
                        </Navbar.Brand>
                    </LinkContainer>
                    {children
                        .map((child) => {
                            // We got the group key, so we take children from the group
                            if (typeof child == "string") {
                                return <NavDropdown   // @ts-ignore
                                    active={location.pathname.includes(groupByTitle[child].path)}
                                    title={child}>
                                    {   // @ts-ignore
                                        groupedChildren[child].map(child => <LinkContainer to={child.path}>
                                                <NavDropdown.Item>{child.title}</NavDropdown.Item>
                                            </LinkContainer>
                                        )}
                                </NavDropdown>
                            } else {
                                return <li className="nav-item">
                                    <NavLink className="nav-link" to={child!.path}>{child!.title}</NavLink>
                                </li>
                            }
                        })
                    }
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}

function App() {

    const [selectedPreset, setSelectedPreset] = useState('')
    const [fullScreen, setFullScreen] = useState(false)
    return (<SiteContext.Provider
            value={{
                preset: {
                    selected: selectedPreset, setSelected: setSelectedPreset,
                }, fullScreen: {
                    fullScreen: fullScreen, setFullScreen: setFullScreen,
                },
            }}>
            <div className="App">
                <NavBar/>
                <Outlet/>
            </div>
        </SiteContext.Provider>
    );
}

export default App;
