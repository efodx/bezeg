import React from 'react';
import './App.css';
import {NavLink, Outlet, useLocation} from "react-router-dom";
import routes from "./Routes";
import Logo from "./images/elderflower.png"
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'

function NavBar() {
    const location = useLocation();
    console.log(location)
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
                return []
            } else {
                return child!
            }
        })
        .filter(child => typeof child != "undefined")
    return <Navbar expand="xl" className="bg-body-tertiary">
        <Container className={"w-100"}>
            <LinkContainer to="/bezeg">
                <Navbar.Brand style={{marginLeft: "1vw"}}>
                    <img src={Logo} width="30" height="30" alt=""/>
                </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {children
                        .map((child) => {
                            // We got the group key, so we take children from the group
                            if (typeof child == "string") {
                                return <NavDropdown
                                    style={{backgroundColor: location.pathname == "lol" ? "white" : "black"}}
                                    title={child}>{   // @ts-ignore
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
    return (
        <div className="App">
            <NavBar/>
            <Outlet/>
        </div>
    );
}

export default App;
