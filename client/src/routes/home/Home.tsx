import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import { useQuery } from "@tanstack/react-query"
import { Quote } from "common/interfaces"
import React, { useEffect } from "react"
import { fetchAsync } from "src/utils/fetchAsync"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { QuoteList } from "../quotes/Quotes"


export default function Home(){
    let auth = useAuth()
    const user = auth.user!;
    useTitle("Hjem")
    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p>Velkommen {user.firstName}!</p>
            <br/>
            <QuoteOfTheDay/>
        </PageContainer>
    )
}

function QuoteOfTheDay(){
    return (
        <Paper elevation={6} sx={{p: 2, maxWidth: "600px"}}>
            <h2 style={{margin: 0}} >Dagens sitater</h2>
            <Divider sx={{mt: 1.5}}/>
            <QuoteLoader/>
        </Paper>
    )
}

function QuoteLoader(){
    const {isLoading, isError, data, error} = useQuery<Quote[]>(["FetchQuoteOfTheDay"], () => fetchAsync<Quote[]>("/api/quotes-of-the-day") )
    
    if (isLoading) {
        return <div style={{minHeight: "100px"}}/>
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <QuoteList quotes={data.filter((item, index) => index <= 3)}/>
    )
}