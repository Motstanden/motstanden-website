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
            <QuoteList/>
        </PageContainer>
    )
}

function QuoteList(){

    const {isLoading, isError, data, error} = useQuery<IQuote[]>(["FetchQuotes"], () => fetchAsync<IQuote[]>("/api/quotes") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
        <ul style={{paddingLeft: "5px"}}>
            {data.map( item => (
                <li key={item.id} 
                    style={{
                        listStyleType: "none", 
                        marginBottom: "25px",
                    }}>
                     <NewlineText text={item.quote}/>
                     <span style={{
                            marginLeft: "20px", 
                            marginTop: 0, 
                            opacity: 0.6, 
                            fontSize: "small", 
                            fontWeight: "bold"
                        }}>
                        – {item.utterer}
                     </span>
                </li>
            ))}
        </ul>
    )
}

function NewlineText({ text }: {text: string}) {
    const newText = text.split('\n').map( (str, i) => <p key={i} style={{margin: 0}}>{str}</p>);
    return <span>{newText}</span>
}

interface IQuote {
    id: string,
    utterer: string,
    quote: string,
}