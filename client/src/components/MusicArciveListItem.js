import React from "react"
import axios from "axios"
import styles from "./MusicArciveListItem.module.css"
import ClipLoader from "react-spinners/ClipLoader"


class MusicArciveListItem extends React.Component {

    constructor(props){
        super(props)

        this.anchor = React.createRef()

        this.state = {
            isLoading: false,
            itemIsDisabled: false,
            url: null,
            initiateClick: false,
        }
    }

    onItemClick = (event) => {
        
        // if(this.state.url) return

        console.log(event.target)
        this.setState({
            isLoading: true,
            itemIsDisabled: true,
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
                // window.open(fileUrl)
                
                // console.log(res.data)
                // console.log(file)


                // let url = window.URL.createObjectURL(res.data)

                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', this.props.title + ".pdf")
                document.body.appendChild(link)
                link.click()

                this.setState({
                    isLoading: false,
                    itemIsDisabled: false,
                    url: fileUrl,
                    initiateClick: true
                })
            })
            .catch( err => console.log(err))
    }

    // componentDidUpdate(){
    //     if(this.state.initiateClick){
    //         console.log(this.state.url)
    //         window.open(this.state.url)
    //         this.setState({
    //             initiateClick: false
    //         })
    //     }
    // }

    render() {

        let buttonStyle = styles.buttonStyle
        if(!this.state.isLoading){
            buttonStyle += " " + styles.buttonHoverStyle
        }


        return (
            <li className={styles.grid}>
                {/* <a  
                    ref={this.anchor}
                    onClick = {this.onItemClick}
                    className = {buttonStyle}
                    disabled={this.state.itemIsDisabled}
                    href={this.state.url}
                    target="_blank"
                    >
                    {this.props.title}
                </a> */}
                <button 
                    onClick = {this.onItemClick}
                    className = {styles.buttonStyle}
                    className = {buttonStyle}
                    disabled={this.state.itemIsDisabled}
                    href={this.state.url}
                    >
                   {this.props.title}
                </button>
                <ClipLoader
                    loading={this.state.isLoading}
                    color={"#18912c"}
                    size={40}
                    className={styles.loadingIconStyle}
                />
        </li>
        )
    }
}

export default MusicArciveListItem