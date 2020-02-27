import React from "react"
import styles from "./MusicArcivePage.module.css"
import axios from "axios"

class MusicArcivePage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            songArray: []
        }

        const accessToken = localStorage.getItem("accessToken")

        axios.get("/api/sheet_arcive_song", {
            headers: {'Authorization': "Bearer " +  accessToken}
            })
            .then( (res) => {
                console.log(res.data)
                this.setState({
                    songArray: res.data
                })
            })
    }

    onSongTitleClick = (id, title) => {
        
        const accessToken = localStorage.getItem("accessToken")

        axios.get("/api/sheet_arcive_file", {
            headers: {'Authorization': "Bearer " +  accessToken},
            responseType: 'blob',
            params: {
                song_id: id
            }})
            .then( res => {
                console.log(res)
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', title + ".pdf")
                document.body.appendChild(link)
                link.click()
            })
            .catch( err => console.log(err))
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
                            <button 
                                onClick ={ (event) => this.onSongTitleClick(song.song_id, song.title, event)}
                                className = {styles.buttonStyle}
                                >
                                {song.title}
                            </button>
                        </li>
                    ))
                }
                </ul>
            </main>
        )
    }
}

export default MusicArcivePage