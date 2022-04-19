import React, { useState, useEffect } from 'react';
import styles from "./NewMusicArchivePage.module.css"
import axios from "axios"
import {Route, 
    Link,
    withRouter,
    Switch} from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";

export default function NewMusicArchivePage() {
    const [songs, setSongs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/sheet_archive/song_title")
             .then( result => setSongs(result.data))
             .catch( err => console.log(err))
             .finally( () => setIsLoading(false)) 
    }, [])

    let failScreen = null;
    if (isLoading == false && !songs){
        failScreen = (<p style={{color:'red'}}>Du må være logget inn for å se notearkivet.</p>)
    }

    const rootPath = "/notearkiv"

    return(
        <Switch>
            <Route exact path="/notearkiv">
                <main className={styles.main}>
                    <h1>Notearkiv</h1>
                    <LoadingScreen isLoading={isLoading} />
                    {failScreen}
                   <ul className={styles.ul} >
                        {songs?.map( (song) => (
                            <div key={song.id}>
                                <li>
                                    <Link to={rootPath + "/" + song.url} className={styles.anchorStyle}>
                                        {song.title}
                                    </Link>
                                </li>
                            </div>
                        ))}
                    </ul> 
                </main>
            </Route>
            {songs?.map( (song) => (
                <Route path={rootPath + "/" + song.url} key={song.id}>
                    <SongPage title = {song.title}/>
                </Route>
            ))}
        </Switch>
    )
}

const LoadingScreen = (props) => {
    if(props.isLoading){
        return (
            <div>
                <ClipLoader size={120} color="green"/>
            </div>
        )
    }
    else {
        return <div></div>
    }
}

const SongPage = props => {
    const [songFiles, setSongFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        const result = await axios.get("/api/sheet_archive/song_file", {
            params: {
                title: props.title
            }})

        if(result.statusText === "OK"){
            setSongFiles(result.data)
        }
        setIsLoading(false)
    }, [])

    let failScreen = null;
    if (isLoading == false && !songFiles){
        failScreen = (<p style={{color:'red'}}>Obs! Noe gikk galt. Prøv å last siden på nytt.</p>)
    }

    let songFileHtml = !songFiles ? <div/> : (
        <table className={styles.tableStyle}>
            <tr>
                <th>Instrument</th>
                <th>Natura</th>
                <th>Nøkkel</th>
            </tr>
            {songFiles?.map( file => {
                // let voiceNum = file.instrument.toLowerCase().startsWith("part") ? "" : " " + file.instrumentVoice
                
                let voiceNum = " " + file.instrumentVoice;
                if(file.instrument.toLowerCase().startsWith("part")){
                    voiceNum = ""
                }
                if (file.instrumentVoice == 1){
                    voiceNum = ""
                }
                
                let fileText = file.instrument + voiceNum
                return (
                    <tr key={file.id}>
                        <td>
                            <a href={window.location.origin + "/" + file.url}
                            type="application/pdf"
                            style={{fontSize:'large'}}
                            className={styles.anchorStyle}>
                                {fileText}
                            </a>
                        </td>
                        <td>{file.transposition}</td>
                        <td>{file.clef}</td>
                    </tr>)
                }
            )}
        </table>
    )


    
    return(
        <main className={styles.main}>
            <h1>{props.title}</h1>
            <LoadingScreen isLoading={isLoading} />
            {failScreen}
            {songFileHtml}
        </main>)

}
