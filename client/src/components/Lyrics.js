import React from "react"
import styles from "./Lyrics.module.css"
import List from "./List.js"


import LyricsData from "./LyricsData.js"
import axios from "axios"

class Lyrics extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            lyricsTitleArray: []
        }

        // axios.get("/api/song_lyric")
        //     .then( (res) => {
                
        //         this.setState({
        //             lyricsTitleArray: res.data.lyricsArray
        //         })
        //     })
        
    }


    render(){
        return(
            <main className={styles.main}>
                {/* <h1>Studenttraller</h1>
                <List itemSource={this.state.lyricsTitleArray} /> */}
                <LyricsData/>
            </main>
        )
    }
}

export default Lyrics
