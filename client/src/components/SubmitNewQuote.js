import React from "react"
import axios from "axios"
import TextareaAutosize from 'react-textarea-autosize';

import styles from "./SubmitNewQuote.module.css"

class SubmitNewQuote extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            utterer: "",
            quote: "",
            submitDisabled: false
        }
    }

    // When there a change in the form update the state
    onInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }  

    onSubmit = (event) => {
        event.preventDefault()

        this.setState({
            submitDisabled: true
        })
        
        // remove padding spaces
        let quote = this.state.quote.trim()
        let utterer = this.state.utterer.trim()
        
        const accessToken = localStorage.getItem("accessToken")

        axios.post("/api/insert_quote", {
            utterer: this.state.utterer,
            quote: quote  
        },{
            headers: {'Authorization': "Bearer " +  accessToken}
        })
        .then( res => {})
        .catch( err => console.log(err))
        .finally(
            setTimeout(() => {
                window.location.reload()
            }, 500)
        )
    } 

    render() {

        return (
            <div>
                <form className ={styles.form} onSubmit={this.onSubmit}>
                    <label htmlFor="utterer"><b>Sitatytrer:</b></label> 
                    <br/>
                    <input 
                        type="text" 
                        name="utterer" 
                        placeholder="Sitatyttrer..."
                        required
                        autoComplete = "off"
                        className={styles.inputTextBox}
                        value={this.state.utterer} 
                        onChange={this.onInputChange}
                        disabled={this.state.submitDisabled}
                        >
                    </input>
                    <br/>
                    <label htmlFor="quote"><b>Sitat:</b></label> <br/>
                    <TextareaAutosize 
                        name="quote" 
                        placeholder="Legg inn sitat..."
                        required
                        autoComplete="off"
                        className={styles.inputTextBox + " " + styles.textAreaBox}
                        value={this.state.quote} 
                        onChange={this.onInputChange}
                        disabled={this.state.submitDisabled}
                    ></TextareaAutosize><br/>
                    <input
                        type="submit" 
                        value="Legg inn sitat"
                        className={styles.submitButton}
                        disabled = {this.state.submitDisabled}
                        >
                    </input>
                </form>
            </div>
        )
    }
} 

export default SubmitNewQuote