import React from "react"
import {BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom"

import "./app.css"
import Home from "./components/pages/Home.js"
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"
import MusicArcivePage from "./components/pages/MusicArcivePage.js"
import LogInPage from "./components/pages/LogInPage.js"
import Debug from "./debug/Debug.js"
import LyricListPage from "./components/pages/LyricListPage"
import NotFound from "./components/pages/NotFound.js"

class App extends React.Component{
    render() {

        console.log("Velkommen til Motstanden sin hjemmeside!")

        return(
            <div>
                <Router>
                    <Header/>
                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route path="/notearkiv">
                            <MusicArcivePage/>
                        </Route>
                        <Route path="/logg-inn">
                            <LogInPage/>
                        </Route>
                        <Route path="/studenttraller">
                            <LyricListPage/>
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
            </div>
        )
    }
}


export default App
