import React from "react"
import styles from "./DocumentsPage.module.css"
import axios from "axios"

class Documents extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            documentsArray: [],
        }
        axios.get("/api/documents")
            .then( (res) => this.setState({ documentsArray: res.data }))
            .catch( (err) => 
            {
                axios.get("/api/documents_public")
                    .then( (res) => this.setState({documentsArray: res.data})) 
            })
            
    }

    render(){
        return(
            <main className={styles.main}> 
                <h1>Dokumenter</h1>
                <ul className={styles.ul}>
                    {this.state.documentsArray.map( (doc, index) =>{
                        return (
                            <li>
                                <a href={window.location.origin + '/' + doc.url} 
                                    type="application/pdf"
                                    className={styles.anchorStyle}>
                                    {doc.title}</a>
                            </li>
                            )
                        })}
                </ul>
            </main> 
        )
    }     
}

export default Documents