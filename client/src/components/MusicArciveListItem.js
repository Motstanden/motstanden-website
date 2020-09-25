import React from "react"
import axios from "axios"
import styles from "./MusicArciveListItem.module.css"
import LoadingButton from "./LoadingButton.js"

class MusicArciveListItem extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
        }
    }

    onItemClick = (event) => {
        this.setState({
            isLoading: true,
        })
        const accessToken = localStorage.getItem("accessToken")
        axios.get("/api/sheet_arcive_file", {
            headers: {'Authorization': "Bearer " +  accessToken},
            responseType: 'blob',
            params: {
                song_id: this.props.itemId
            }})
            .then( res => {

                const file = new Blob([res.data], {type: "application/pdf"})
                const fileUrl = URL.createObjectURL(file)
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', this.props.title + ".pdf")
                document.body.appendChild(link)
                link.click()

                this.setState({
                    isLoading: false,
                })
            })
            .catch( err => console.log(err))
    }

    render() {
        return (
            <LoadingButton 
                onClick={(e) => this.onItemClick(e)} 
                isLoading={this.state.isLoading}
                text={this.props.title}
            />
        )
    }
}

export default MusicArciveListItem