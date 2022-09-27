import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Quote, Rumour } from "common/interfaces"
import React, { useEffect } from "react"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { QuoteList, ListSkeleton as QuotesListSkeleton } from "../quotes/QuotesPage"
import { RumourList, ListSkeleton as RumourListSkeleton } from "../rumour/RumourPage"


export default function Home(){
    useTitle("Hjem")

    const user = useAuth().user!

    const renderQuotes = (items: Quote[], refetchItems: VoidFunction) => <QuoteList quotes={items} onItemChanged={refetchItems} />

    const renderRumours = (items: Rumour[], refetchItems: VoidFunction) => {
        return (
            <RumourList 
                rumours={items}
                onItemChanged={refetchItems}        
            />
        )
    }

    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p>Velkommen {user.firstName}!</p>
            <Grid container spacing={4} sx={{mt: 4}} >
                <ItemOfTheDay 
                    title="Dagens sitater" 
                    fetchUrl="/api/quotes/daily-quotes" 
                    renderSkeleton={<QuotesListSkeleton length={3}/>}
                    renderItems={renderQuotes}
                />
                <ItemOfTheDay
                    title="Dagens rykter"
                    fetchUrl="/api/rumours/daily-rumour"
                    renderSkeleton={<RumourListSkeleton length={4}/>}
                    renderItems={renderRumours}
                />
            </Grid>
        </PageContainer>
    )
}

function ItemOfTheDay<T>({
    title, 
    fetchUrl, 
    renderSkeleton,
    renderItems
}: {
    title: string, 
    fetchUrl: string, 
    renderSkeleton: React.ReactElement,
    renderItems: (items: T[], refetchItems: VoidFunction) => React.ReactElement,
} ){
    return (
        <Grid item xs={12} sm={12} md={6} >
            <TitleCard 
                title={title} 
                sx={{maxWidth: "600px", height: "100%"}}>
                <ItemLoader<T>
                    queryKey={ [`${title}: ${fetchUrl}`] } 
                    fetchUrl={fetchUrl} 
                    renderSkeleton={renderSkeleton}
                    renderItems={renderItems}
                    />
            </TitleCard>
        </Grid>
    )
}

function ItemLoader<T>({
    queryKey, 
    fetchUrl, 
    renderSkeleton,
    renderItems
}: {
    queryKey: any[], 
    fetchUrl: string, 
    renderSkeleton: React.ReactElement,
    renderItems: (items: T[], refetchItems: VoidFunction) => React.ReactElement
}) {

    
    const queryClient = useQueryClient()
    const onRefetchItems = () => queryClient.invalidateQueries(queryKey)

    const {isLoading, isError, data, error} = useQuery<T[]>(queryKey, () => fetchAsync<T[]>(fetchUrl) )

    if (isLoading) {
        return (
            <>
                {renderSkeleton}
            </>
        )
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <>
            {renderItems(data, onRefetchItems)}
        </>
    )
}