import React from "react"
import {BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom"

import "./app.css"

import Header from "./components/Header.js"
import Home from "./components/pages/Home.js"
import BecomeAMember from "./components/pages/BecomeAMember.js"
import MusicArcivePage from "./components/pages/MusicArcivePage.js"
import LyricListPage from "./components/pages/LyricListPage"
import QuotesPage from "./components/pages/QuotesPage.js"
import DocumentsPage from "./components/pages/DocumentsPage.js"
import LogInPage from "./components/pages/LogInPage.js"
import Debug from "./debug/Debug.js"
import NotFound from "./components/pages/NotFound.js"
import Footer from "./components/Footer.js"


class App extends React.Component{
    render() {

        console.log("Velkommen til Motstanden sin hjemmeside!")

        return(
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/bli-medlem">
                        <BecomeAMember/>
                    </Route>
                    <Route path="/notearkiv">
                        <MusicArcivePage/>
                    </Route>
                    <Route path="/studenttraller">
                        <LyricListPage/>
                    </Route>
                    <Route path="/sitater">
                        <QuotesPage/>
                    </Route>
                    <Route path="/logg-inn">
                        <LogInPage/>
                    </Route>
                    <Route exact path="/dokumenter">
                        <DocumentsPage/>
                    </Route>
                    <Route path="/debug">
                        <Debug/>
                    </Route>
                    <Route path="*">
                        <NotFound/>
                    </Route>
                </Switch>
                <Footer/>
            </Router>
        )
    }
}


export default App
