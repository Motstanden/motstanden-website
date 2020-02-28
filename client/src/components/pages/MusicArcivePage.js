import React from "react"
import styles from "./MusicArcivePage.module.css"
import axios from "axios"

import MusicArciveListItem from "./../MusicArciveListItem.js"

import ClipLoader from "react-spinners/ClipLoader"

class MusicArcivePage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            songArray: [],
            loadingIconArray: []
        }

        const accessToken = localStorage.getItem("accessToken")

        axios.get("/api/sheet_arcive_song", {
            headers: {'Authorization': "Bearer " +  accessToken}
            })
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
                        <MusicArciveListItem
                            title = {song.title} 
                            itemId={song.song_id}    
                        />
                    ))
                }
                </ul>
            </main>
        )
    }
}

export default MusicArcivePage