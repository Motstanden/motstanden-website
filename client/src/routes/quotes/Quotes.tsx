import React from "react"
import { useQuery } from "@tanstack/react-query"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"
import { NewQuoteForm } from "./NewQuoteForm"
import Divider from "@mui/material/Divider"
import { useTitle } from "../../hooks/useTitle"

export default function Quotes(){
    useTitle("Sitater")
    return (
        <PageContainer>
            <h1>Nytt sitat</h1>
            <NewQuoteForm/>
            <Divider sx={{my: "40px"}}/>
            <h1 style={{marginTop: "0px"}}>Sitater</h1>
            <QuotesContainer/>
        </PageContainer>
    )
}

function QuotesContainer() {
    const {isLoading, isError, data, error} = useQuery<QuoteData[]>(["FetchQuotes"], () => fetchAsync<QuoteData[]>("/api/quotes") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
        <QuoteList quotes={data}/>
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
                – {quoteData.utterer}
                </span>
        </li>
    )
}   

function NewlineText({ text }: {text: string}) {
    const newText = text.split('\n').map( (str, i) => <p key={i} style={{margin: 0}}>{str}</p>);
    return <span>{newText}</span>
}

interface QuoteData {
    id: string,
    utterer: string,
    quote: string,
}