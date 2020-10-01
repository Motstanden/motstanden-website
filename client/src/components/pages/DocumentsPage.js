import React from "react"
import styles from "./DocumentsPage.module.css"
import axios from "axios"
import LoadingButton from "../LoadingButton.js"

class Documents extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            documentsArray: [],
            isLoadingArray: []
        }
        const accessToken = localStorage.getItem("accessToken")
        axios.get("/api/documents", {
            headers: {'Authorization': "Bearer " +  accessToken}
            })
            .then( (res) => {
                var isLoading = res.data.map( () => false )
                this.setState({
                    documentsArray: res.data,
                    isLoadingArray: isLoading
                })
            })
    }

    onDocumentClick = (doc, index) => {
        var isLoading = this.state.isLoadingArray.slice();
        isLoading[index] = true;
        this.setState({
            isLoadingArray: isLoading
        })
        const accessToken = localStorage.getItem("accessToken")
        axios.get("/api/document_file", {
            headers: {'Authorization': "Bearer " +  accessToken},
            responseType: 'blob',
            params: {
                file: doc.file
            }})
            .then( res => {

                const file = new Blob([res.data], {type: "application/pdf"})
                const fileUrl = URL.createObjectURL(file)
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', doc.title + ".pdf")
                document.body.appendChild(link)
                link.click()
                isLoading[index] = false;
                this.setState({
                    isLoadingArray: isLoading,
                })
            })
            .catch( err => console.log(err))
    }

    render(){
        if (this.state.documentsArray.length > 0){
            return(
               <main className={styles.main}> 
                    <h1>Dokumenter</h1>
                    <ul>
                        {this.state.documentsArray.map( (doc, index) =>{
                            return (
                                <LoadingButton 
                                text={doc.title}
                                isLoading={this.state.isLoadingArray[index]}
                                onClick={ () => {this.onDocumentClick(doc, index)}} 
                                />
                                )
                            })}
                    </ul>
               </main> 
            )
        }   
        else{
            return(
                <main className={styles.main}>
                    <p className={styles.red}>Du må være logget inn for å se dokumenter</p>
                </main>
            )
        }     
    }
}

export default Documents