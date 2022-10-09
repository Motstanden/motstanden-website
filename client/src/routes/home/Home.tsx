import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import { Link as RouterLink } from "react-router-dom"
import Paper from "@mui/material/Paper"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EventData, Quote, Rumour } from "common/interfaces"
import React, { useEffect } from "react"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { buildEventItemUrl } from "../event/Context"
import { QuoteList, ListSkeleton as QuotesListSkeleton } from "../quotes/QuotesPage"
import { RumourList, ListSkeleton as RumourListSkeleton } from "../rumour/RumourPage"
import dayjs from "dayjs"
import Skeleton from "@mui/material/Skeleton"


export default function Home(){
    useTitle("Hjem")
    const user = useAuth().user!
    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p style={{marginBottom: "40px"}}>Velkommen {user.firstName}!</p>
            <Grid container spacing={4} >
                <ItemOfTheDay 
                    title="Arrangement" 
                    fetchUrl="/api/events/upcoming?limit=5" 
                    renderSkeleton={<EventListSkeleton length={5}/>}
                    renderItems={RenderEventList}
                />
                <NoItem/>
                <InfoItem
                    title="Nyttige lenker"
                />
                <ItemOfTheDay 
                    title="Nyeste sitater" 
                    fetchUrl="/api/quotes?limit=3" 
                    renderSkeleton={<QuotesListSkeleton length={3}/>}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay
                    title="Nyeste rykter"
                    fetchUrl="/api/rumours?limit=3"
                    renderSkeleton={<RumourListSkeleton length={3}/>}
                    renderItems={RenderRumourList}
                />
                <ItemOfTheDay 
                    title="Dagens sitater" 
                    fetchUrl="/api/quotes/daily-quotes" 
                    renderSkeleton={<QuotesListSkeleton length={3}/>}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay
                    title="Dagens rykter"
                    fetchUrl="/api/rumours/daily-rumour"
                    renderSkeleton={<RumourListSkeleton length={3}/>}
                    renderItems={RenderRumourList}
                />
            </Grid>
        </PageContainer>
    )
}

type RenderItemProps<T> = {
    items: T[], 
    refetchItems: VoidFunction
}

function RenderEventList(props: RenderItemProps<EventData> ){
    return (
        <ul style={{
            listStyle: "none", 
            paddingLeft: "10px"
            }}
        >
            {props.items.map( (event, index) => ( 
                <li key={`${index} ${event.title}}`} style={{marginBottom: "15px"}}>
                    <Link 
                        color="secondary" 
                        component={RouterLink}
                        to={buildEventItemUrl(event)}
                        underline="hover"
                        >
                            {event.title}
                    </Link>              
                    <div style={{
                            marginLeft: "15px",
                            opacity: 0.65,
                            fontSize: "small"
                        }} 
                    > 
                        {dayjs(event.startDateTime).format("dddd D. MMM k[l]: HH:mm")}
                    </div>                
                </li>
            ))}
        </ul>
    )
}

function EventListSkeleton( {length}: {length: number}){
    return(
        <>
            <ul style={{
                listStyle: "none", 
                paddingLeft: "10px"
            }}
            >
                { Array(length).fill(1).map( (_, i) => (
                    <li key={i} style={{marginBottom: "15px"}}>
                        <div>
                            <Skeleton style={{width: "125px", height: "2em"}} />
                        </div>
                        <div>
                            <Skeleton style={{marginLeft: "15px", width: "155px"}} />                        
                        </div>                
                    </li>
                ))}
            </ul>
        </>
    )    
}

function RenderRumourList( props: RenderItemProps<Rumour>) {
    return (
        <>
            <div style={{
                opacity: 0.6, 
                fontSize: "small", 
                marginBottom: "-10px", 
                marginLeft: "5px"
            }}>
                <em>
                    <strong>
                        Har du hørt at...
                    </strong>
                </em>
            </div>
            <RumourList 
                rumours={props.items}
                onItemChanged={props.refetchItems}        
                />
        </>
    )
}

function RenderQuotesList(props: RenderItemProps<Quote>) {
    return (
        <QuoteList 
            quotes={props.items} 
            onItemChanged={props.refetchItems} />
    )
}

function RenderInfo() {
    return (
        <ul style={{
            listStyle: "none", 
            paddingLeft: "10px"
            }}
        >
            <h1>hello</h1>
        </ul>
    )
}

function NoItem(){
    return (
        <Grid 
            item 
            xs={12} sm={12} md={6} 
            display={{xs: "none", xm: "none", md: "block"}}/>
    )
}



function InfoItem({
    title
}: {
    title: string
}) {
    return (
        <Grid item xs={12} sm={12} md={6} >
            <TitleCard 
                title={title}
                sx={{maxWidth: "600px", height: "100%"}}
                >
                <RenderInfo />
            </TitleCard>
        </Grid>
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
    renderItems: (props: RenderItemProps<T>) => React.ReactElement,
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
    renderItems: (props: RenderItemProps<T>) => React.ReactElement
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
            {renderItems({items: data, refetchItems: onRefetchItems})}
        </>
    )
}
