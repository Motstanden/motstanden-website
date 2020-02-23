import React from "react"
import styles from "./MusicArcivePage.module.css"



class MusicArcivePage extends React.Component {
    render(){
        return (
            <main className={styles.main}>
                <h1>Notearkiv</h1>
                <p className={styles.errorMessage}>Du må være logget inn for å se notearkivet.</p>
            </main>
        )
    }
}

export default MusicArcivePage