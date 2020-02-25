import React from "react"
import {Route} from "react-router-dom"
import axios from "axios"

class LyricItemPage extends React.Component {
    constructor(props){
        super(props)

        let lyricData = null
        if(sessionStorage.getItem(this.props.title)){
            lyricData = sessionStorage.getItem(this.props.title)
        }

        this.state ={
            lyric: lyricData
        }
    }

    componentDidMount() {
        if(this.state.lyric == null){
            axios.get("/api/song_lyric_data", {
                params: {
                    title: this.props.title
                }})
                .then( res => {

                    let lyricData = res.data.lyricsData
                    sessionStorage.setItem(this.props.title, lyricData)

                    this.setState({
                        lyric: lyricData
                    })
                })
                .catch(err => console.log)}
    }

    render() {

        return (
            <main>
                <h1> {this.props.title}</h1>
                <div dangerouslySetInnerHTML={{
                    __html: this.state.lyric}}>
                
                </div> 
            </main>
        )
    }
}

export default LyricItemPage
