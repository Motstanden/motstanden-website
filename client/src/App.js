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
import Lyrics from "./components/Lyrics.js"
import NotFound from "./components/pages/NotFound.js"

class App extends React.Component{
    render() {
        return(
            <div>
                <Router>
                    <Header/>
                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route exact path="/notearkiv">
                            <MusicArcivePage/>
                        </Route>
                        <Route exact path="/logg-inn">
                            <LogInPage/>
                        </Route>
                        <Route exact path="/studenttraller">
                            <Lyrics/>
                        </Route>
                        <Route exact path="/debug">
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
