import React from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../Authentication"

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
        <header>
            Motstanden 
            <br/>
            <NavBar/>
        </header>
    )
}

function NavBar(){
    let auth = useAuth()
    return auth.user ? <LoggedInNavBar/> : <LoggedOutNavBar/>
}

function LoggedInNavBar(){
    return (
        <nav>
            <Link to="/hjem">Hjem</Link> 
            <Separator/>
            <Link to="/studenttraller">Studenttraller</Link>
            <Separator/>
            <Link to="/dokumenter">Dokumenter</Link>
            <Separator/>
            <Link to="/sitater">Sitater</Link>
            <Separator/>
            <Link to="/notearkiv">Notearkiv</Link>
            <Separator/>
            <LogOutBtn/>
        </nav>
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
        <nav>
            <Link to="/">Startside</Link>
            <Separator/>
            <Link to="/bli-medlem">Bli Medlem</Link>
            <Separator/>
            <Link to="/studenttraller">Studenttraller</Link>
            <Separator/>
            <Link to="/dokumenter">Dokumenter</Link>
            <Separator/>
            <Link to="/logg-inn">Logg inn</Link>
        </nav>
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
