import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Quote } from "common/interfaces"
import React, { useEffect } from "react"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { QuoteList, ListSkeleton } from "../quotes/QuotesPage"


export default function Home(){
    let auth = useAuth()
    const user = auth.user!;
    useTitle("Hjem")
    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p>Velkommen {user.firstName}!</p>
            <br/>
            <TitleCard title="Dagens sitater" sx={{maxWidth: "600px"}}>
                <QuoteLoader/>
            </TitleCard>
        </PageContainer>
    )
}

function QuoteLoader(){

    const queryClient = useQueryClient()
    const queryKey = ["FetchQuoteOfTheDay"]    
    const onItemChanged = () => queryClient.invalidateQueries(queryKey)

    const {isLoading, isError, data, error} = useQuery<Quote[]>(queryKey, () => fetchAsync<Quote[]>("/api/quotes-of-the-day") )

    if (isLoading) {
        return (
            <>
                <ListSkeleton length={3}/>
            </>
        )
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <QuoteList quotes={data.filter((item, index) => index <= 3)} onItemChanged={onItemChanged}/>
    )
}