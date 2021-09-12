import React, {useState} from "react"

import {Route, 
        Link,
        withRouter,
        Switch} from "react-router-dom"
import LyricItemPage from "./LyricItemPage.js"
import axios from "axios"

import styles from "./LyricListPage.module.css"

class LyricListPage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            lyrics: [],
            path: "/studenttraller"
        }        
        axios.get("/api/song_lyric")
            .then( (res) => {
                this.setState({
                    lyrics: res.data
                })
            })
            .catch( err => console.log(err))
    }

    componentDidMount(){}

    render(){
        return(
            <Switch>            
                <Route exact path="/studenttraller">
                    <main className={styles.main}>
                        <h1>Studenttraller</h1>

                        <ul className={styles.ul}> 

                            {this.state.lyrics.map( (item) => (
                                <div key={item.title}>
                                    <li className={styles.li}>
                                        <Link to={this.state.path + "/" + item.title}>
                                            {item.title}
                                        </Link>
                                    </li>
                                </div>
                            ))}

                        </ul>
                    </main>
                </Route>
                {this.state.lyrics.map( (item) => (
                    <Route path={this.state.path + "/" + item.title}>
                        <LyricItemPage title = {item.title}/>
                    </Route>
                ))}
            </Switch>
        )
    }
}

export default withRouter(LyricListPage)
