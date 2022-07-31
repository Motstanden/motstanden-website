import React from "react"
import { useQuery } from "@tanstack/react-query"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export default function Quotes(){
    return (
        <PageContainer>
            <h1>Sitater</h1>
            <QuoteList/>
        </PageContainer>
    )
}

function QuoteList(){

    const {isLoading, isError, data, error} = useQuery<IQuote[]>(["FetchDocuments"], () => fetchAsync<IQuote[]>("/api/quotes") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
        <ul style={{paddingLeft: "5px"}}>
            {data.map( item => (
                <li key={item.quote} 
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
    const newText = text.split('\n').map(str => <p style={{margin: 0}}>{str}</p>);
    console.log(newText, text)
    return <span>{newText}</span>
}

interface IQuote {
    utterer: string,
    quote: string,
}