import React from "react"
import axios from "axios"

import styles from "./QuotesPage.module.css"

import SubmitNewQuote from "./../SubmitNewQuote.js"

class QuotesPage extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            quotesArray: []
        }

        const accessToken = localStorage.getItem("accessToken")

        axios.get("/api/quotes", {
            headers: {'Authorization': "Bearer " +  accessToken}
            })
            .then( (res) => {

                this.setState({
                    quotesArray: res.data,
                })
            })
    }

    render(){

        const quotes = this.state.quotesArray.map( item => {

            // Format new lines in the text
            let newText = item.quote.split('\n').map ((textLine, index) => (
                <span className={styles.quoteLineStyle}
                    key={index.toString() + textLine}>{textLine}<br/> 
                </span>
                    ) 
            );

            return (<li className={styles.li}>
                        <div className={styles.quoteTitleStyle} >
                            <strong>{item.utterer}:</strong><br/>
                        </div>
                        <div>
                            <em>{newText}</em>
                        </div>
                    </li>)
        })

        if(this.state.quotesArray.length !== 0){
            return (
                <main className={styles.main}>
                    <h1>Legg inn sitat</h1>
                    <SubmitNewQuote/>
                    <hr/>
                    <h1>Sitat</h1>
                    <ul>
                        {quotes}
                    </ul>
                </main>
            )
        }
        else{
            return(
                <main className={styles.main}>
                    <p className={styles.red}>Du må være logget inn for å se sitater</p>
                </main>
            )
        }
    }
}

export default QuotesPage