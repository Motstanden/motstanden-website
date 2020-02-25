import React, {useState} from "react"

import {Route, 
        Link,
        withRouter,
        Switch} from "react-router-dom"
import LyricItemPage from "./LyricItemPage.js"
import axios from "axios"

class LyricListPage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            lyricsTitleArray: [],
            lyricsHtml: null,
            path: "/studenttraller"
        }        
        axios.get("/api/song_lyric_title")
            .then( (res) => {
                this.setState({
                    lyricsTitleArray: res.data.lyricsArray
                })
            })
            .catch( err => console.log(err)) 
    }

    componentDidMount(){}

    render(){
        
        return(
            <Switch>            
                <Route exact path="/studenttraller">
                    <main>
                        <h1>Studenttraller</h1>
                        <ul> 
                            {this.state.lyricsTitleArray.map( (item) => (
                                <div key={item.title}>
                                    <li>
                                        <Link to={this.state.path + "/" + item.title}>
                                            {item.title}
                                        </Link>
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </main>
                </Route>
                {this.state.lyricsTitleArray.map( (item) => (
                    <Route path={this.state.path + "/" + item.title}>
                        <LyricItemPage title = {item.title}/>
                    </Route>
                ))}
            </Switch>
        )
    }
}

export default withRouter(LyricListPage)
