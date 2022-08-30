import React from "react"
import { useTitle } from "../../hooks/useTitle"
import { Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"

export default function QuotesPage(){
    useTitle("Sitater")
    const data = useOutletContext<QuoteData[]>()
    return (
        <>
            <h1>Sitater</h1>
            <QuoteList quotes={data}/>
        </>
    )
}

export function QuoteList( {quotes}: {quotes: QuoteData[] } ){
    return (
        <ul style={{ 
                paddingLeft: "5px", 
                listStyleType: "none" 
        }}>
            { quotes.map( item => <QuoteItem key={item.id} quoteData={item}/>)}
        </ul>
    )
}

function QuoteItem( {quoteData}: {quoteData: QuoteData}){
    return ( 
        <li 
            style={{ marginBottom: "25px" }}>
                <NewlineText text={quoteData.quote}/>
                <span style={{
                    marginLeft: "20px", 
                    marginTop: 0, 
                    opacity: 0.6, 
                    fontSize: "small", 
                    fontWeight: "bold"
                }}>
                – {`${quoteData.utterer}, ${dayjs(quoteData.createdAt).utc(true).local().format("D MMMM YYYY")}`}
                </span>
        </li>
    )
}   

function NewlineText({ text }: {text: string}) {
    const newText = text.split('\n').map( (str, i) => <p key={i} style={{margin: 0}}>{str}</p>);
    return <span>{newText}</span>
}
