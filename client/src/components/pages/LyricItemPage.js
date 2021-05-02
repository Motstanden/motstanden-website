import React from "react"
import axios from "axios"

import styles from "./LyricItemPage.module.css"


class LyricItemPage extends React.Component {
    constructor(props){
        super(props)

        this.state ={
            lyric: null
        }
    }

    componentDidMount() {
        if(this.state.lyric == null){
            axios.get("/api/song_lyric_data", {
                params: {
                    title: this.props.title
                }})
                .then( res => {
                    this.setState({
                        lyric: res.data.lyricHtml
                    })
                })
                .catch(err => console.log)}
    }

    render() {

        return (
            <main className={styles.main}>
                <h1> {this.props.title}</h1>
                <div className={styles.lyricContainer} dangerouslySetInnerHTML={{
                    __html: this.state.lyric}}>
                </div> 
            </main>
        )
    }
}

export default LyricItemPage
