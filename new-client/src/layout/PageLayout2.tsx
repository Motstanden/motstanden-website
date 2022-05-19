import React from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../contextProviders/Authentication"

import ResponsiveAppBar from "./appBar/ResponsiveAppBar"

export default function PageLayout(){
    return(
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

function Header(){
    return (
        <ResponsiveAppBar/>
    )
}

function NavBar(){
    let auth = useAuth()
    return auth.user ? <LoggedInNavBar/> : <LoggedOutNavBar/>
}

function LoggedInNavBar(){
    return (
        <></>
    )
}

function LogOutBtn(){
    let auth = useAuth()
    let navigate = useNavigate()
    
    const onClick = () => {
        auth.signOut( () => navigate("/") )
    }

    return (
        <button onClick={onClick}>
            Logg ut
        </button>
    )
}

function LoggedOutNavBar(){
    return (
       <></>
    )
}

function Separator(){
    return <>{" "} | {" "}</>
}

function Footer(){
    return (
        <footer>
        </footer>
    )
}
