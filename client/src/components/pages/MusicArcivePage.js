import React from "react"
import styles from "./MusicArcivePage.module.css"
import axios from "axios"

class MusicArcivePage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            songArray: [],
        }
        axios.get("/api/sheet_arcive")
            .then( (res) => {
                this.setState({
                    songArray: res.data,
                })
            })
    }

    render(){

        let error = null
        let introduction = null
        if (this.state.songArray.length === 0){
            error = (
                <p className={styles.errorMessage}>
                    Du må være logget inn for å se notearkivet.
                </p>)
        }
        else {
            introduction = (<p>Obs: Noen av filene har en stor størrelse. Det kan derfor ta et par sekunder før de blir lastet inn i nettleseren.</p>)
        }

        return (
            <main className={styles.main}>
                <h1>Notearkiv</h1>
                {error}
                {introduction}
                <ul className={styles.ul}>
                {
                    this.state.songArray.map( (song) => (
                        <li>
                            <a href={window.location.origin + song.url} 
                                type="application/pdf"
                                className={styles.anchorStyle}>
                                {song.title}
                            </a>
                        </li>
                    ))
                }
                </ul>
            </main>
        )
    }
}

export default MusicArcivePage