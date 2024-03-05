import { Grid, Link, Skeleton, Stack } from "@mui/material";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentEntityType } from "common/enums";
import { EntityComment, EventData, Poll, Quote, Rumour } from "common/interfaces";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { TitleCard } from "src/components/TitleCard";
import { UserAvatar, UserAvatarSkeleton } from 'src/components/user/UserAvatar';
import { UserFullName } from 'src/components/user/UserFullName';
import { useTimeZone } from "src/context/TimeZone";
import { useTitle } from "src/hooks/useTitle";
import { buildEventItemUrl } from "src/routes/event/Context";
import { QuoteList } from "src/routes/quotes/ListPage";
import { QuotesListSkeleton } from "src/routes/quotes/skeleton/ListPage";
import { RumourList } from "src/routes/rumour/RumourPage";
import { fetchFn } from "src/utils/fetchAsync";
import { BoardPageUtils, RawProjectData } from "../boardWebsiteList/BoardWebsiteList";
import { pollBaseQueryKey } from "../poll/Context";
import { PollCard } from '../poll/components/PollCard';
import { PollCardSkeleton } from '../poll/skeleton/PollCard';
import { RumourListSkeleton } from "../rumour/skeleton/RumourPage";


export default function Home() {
    useTitle("Hjem")
    return (
        <>
            <h1>Hjem</h1>
            <Grid 
                container 
                spacing={4} 
                style={{maxWidth: "1265px"}}
            >
                <ItemOfTheDay
                    title="Arrangement"
                    fetchUrl="/api/events/upcoming?limit=5"
                    renderSkeleton={<TitleAndSubtitleSkeleton length={5} />}
                    renderItems={RenderEventList}
                    md={6}
                />
                <ItemOfTheDay
                    title="Nyeste sitater"
                    fetchUrl="/api/quotes?limit=3"
                    renderSkeleton={<QuotesListSkeleton length={3} />}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay 
                    title="Nyeste kommentarer"
                    fetchUrl="/api/comments/all?limit=5"
                    renderItems={RenderComments}
                    renderSkeleton={<RenderCommentsSkeleton length={5}/>}
                />
                <Grid item xs={12} sm={12} md={6}>
                    <LatestPoll/>
                </Grid>
                <ItemOfTheDay
                    title="Nyeste rykter"
                    fetchUrl="/api/rumours?limit=3"
                    renderSkeleton={<RumourListSkeleton length={3} />}
                    renderItems={RenderRumourList}
                />
                <ItemOfTheDay 
                    title="Sist oppdaterte styrenettsider"
                    fetchUrl="https://styret.motstanden.no/projectData.json"
                    renderItems={RenderBoardPageList}
                    renderSkeleton={<TitleAndSubtitleSkeleton length={5}/>}
                />
                <ItemOfTheDay
                    title="Dagens sitater"
                    fetchUrl="/api/quotes/daily-quotes"
                    renderSkeleton={<QuotesListSkeleton length={3} />}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay
                    title="Dagens rykter"
                    fetchUrl="/api/rumours/daily-rumour"
                    renderSkeleton={<RumourListSkeleton length={3} />}
                    renderItems={RenderRumourList}
                />
                <InfoCard
                    title="Nyttige lenker"
                />
            </Grid>
        </>
    )
}

type RenderItemProps<T> = {
    items: T,
    refetchItems: VoidFunction
}

function RenderEventList(props: RenderItemProps<EventData[]>) {
    if(props.items.length <= 0)
        return <span style={{opacity: 0.75 }}>Ingen kommende arrangementer...</span>

    return (
        <ul style={{
            listStyle: "none",
            paddingLeft: "10px"
        }}
        >
            {props.items.map((event, index) => (
                <li key={`${index} ${event.title}}`} style={{ marginBottom: "15px" }}>
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
                        {dayjs.utc(event.startDateTime).tz().format("dddd D. MMM k[l]: HH:mm")}
                    </div>
                </li>
            ))}
        </ul>
    )
}

function RenderComments(props: RenderItemProps<EntityComment[]>) {

    const buildUrl = (comment: EntityComment): string  => {
        switch(comment.type) {
            case CommentEntityType.Event:
                return `/arrangement/${comment.entityId}#comment-${comment.id}`
            case CommentEntityType.Poll:    
                return `/avstemninger/${comment.entityId}#comment-${comment.id}`   
            case CommentEntityType.SongLyric:
                return `/studenttraller/${comment.entityId}#comment-${comment.id}`
            case CommentEntityType.WallPost:
                return `/vegg/${comment.entityId}#comment-${comment.id}`
            default:
                return ``
        }
    }

    if(props.items.length <= 0)
        return <span style={{opacity: 0.75 }}>Ingen nye kommentarer...</span>

    return (
        <>
        {props.items.map((comment, index) => (
            <div 
                key={`${comment.entityId}-${comment.id}`}
                style={{
                    marginBottom: "15px",
                }}
            >
                <Stack 
                    direction="row"
                    spacing={2}
                >
                    <UserAvatar
                        userId={comment.createdBy}
                        style={{
                            marginTop: "5px"
                        }}
                    />
                    <div>
                        <div>
                            <UserFullName 
                                userId={comment.createdBy} 
                                style={{
                                    opacity: "0.75",
                                    fontSize: "small"
                                }}
                                />
                        </div>
                        <div>
                            <Link
                                color="secondary"
                                underline="hover"
                                fontSize="large"
                                component={RouterLink}
                                to={buildUrl(comment) ?? "#"}
                            >
                                {comment.comment.substring(0, 75).trim() + (comment.comment.trim().length > 75 ? "..." : "")}
                            </Link>
                        </div>
                        <div
                            style={{
                                fontSize: "small",
                                opacity: "0.6"
                            }}
                        >
                            {dayjs.utc(comment.createdAt).fromNow()}
                        </div>
                    </div>
                </Stack>
            </div>
        ))}
        </>
    )
}

function RenderCommentsSkeleton({length}: {length: number}) {
    return (
        <div>
            {Array(length).fill(1).map((_, i) => (
                <div
                    key={i}
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <UserAvatarSkeleton 
                            style={{
                                marginTop: "5px"
                            }}
                        />
                        <div style={{width: "80%"}}>
                            <div>
                                <Skeleton 
                                    variant="text" 
                                    style={{ 
                                        fontSize: "small",
                                        maxWidth: "100px",
                                    }} />
                            </div>
                            <div>
                                <Skeleton 
                                    variant="text" 
                                    style={{ 
                                        fontSize: "larger",
                                    }} />
                            </div>
                            <div>
                                <Skeleton
                                    variant="text"
                                    style={{
                                        fontSize: "small",
                                        maxWidth: "80px"
                                    }}
                                />
                            </div>
                        </div>
                    </Stack>
                </div>
            ))}

        </div>
    )
}
 
function LatestPoll() {

    const queryKey = [...pollBaseQueryKey, "latest"]
    const {isPending, isError, data, error} = useQuery<Poll>({
        queryKey: queryKey,
        queryFn: fetchFn<Poll>("/api/polls/latest")
    })

    if(isPending) {
        return (
            <PollCardSkeleton style={{height: "100%",  maxWidth: "600px"}}/>
        )
    }

    if(isError) {
        return <></>
    }

    return (
        <PollCard 
            poll={data} 
            style={{
                maxWidth: "600px",
                height: "100%"
            }}
        />
    )
}

function TitleAndSubtitleSkeleton({ length }: { length: number }) {
    return (
        <>
            <ul style={{
                listStyle: "none",
                paddingLeft: "10px"
            }}
            >
                {Array(length).fill(1).map((_, i) => (
                    <li key={i} style={{ marginBottom: "10px" }}>
                        <div>
                            <Skeleton variant="text" style={{ width: "125px", height: "1.5em" }} />
                        </div>
                        <div>
                            <Skeleton variant="text" style={{ marginLeft: "15px", width: "155px", height: "0.80em"  }} />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

function RenderRumourList(props: RenderItemProps<Rumour[]>) {
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

function RenderQuotesList(props: RenderItemProps<Quote[]>) {
    return (
        <QuoteList
            quotes={props.items}
            onItemChanged={props.refetchItems} />
    )
}

function NoItem( { hide }: { hide?: boolean }) {
    if(hide)
        return <></>

    return (
        <Grid
            item
            xs={12} sm={12} md={6}
            display={{ xs: "none", xm: "none", md: "block" }} />
    )
}

function RenderBoardPageList(props: RenderItemProps<RawProjectData>){
    const pages = BoardPageUtils.cleanPageData(props.items.pages)
    
    const updatedPages = pages.filter(page => page.isUpdated)
        .sort((a, b) => BoardPageUtils.compareByTimestamp(a.updated, b.updated, "desc"))
        .slice(0, 4)

    const formatUpdateText = (date: Dayjs | undefined) => {
        if(!date)
            return ""

        else if(date.isSame(dayjs(), "day"))
            return "Oppdatert i dag"

        else if(date.isAfter(dayjs().subtract(1, "year")))
            return `Oppdatert ${date.fromNow()}`

        return `Oppdatert ${date.format("D. MMM YYYY")}`     
    }   

    return (
        <ul style={{ 
            listStyle: "none", 
            paddingLeft: "10px" 
            }} 
        >
            {updatedPages.map((page, index) => (
                <li key={index} style={{ marginBottom: "20px"}}>
                    <Link 
                        color="secondary"
                        href={`https://styret.motstanden.no/${page.relativeUrl}`}
                        underline="hover"
                    >
                        Styrenettside {page.year}
                    </Link>
                    <div style={{
                                paddingLeft: "10px",
                                opacity: 0.65,
                                fontSize: "small",
                        }}>
                        {formatUpdateText(page.updated)}
                    </div>
                </li>
            ))}
        </ul>
    )

}

interface InfoItem {
    link: string,
    title: string,
    subtitle: string,
}

function InfoCard({
    title
}: {
    title: string
}) {

    const items: InfoItem[] = [{
        link: "https://www.facebook.com/groups/399149784137861",
        title: "Facebook medlemsgruppe",
        subtitle: "Facebookgruppe",
    }, {
        link: "https://www.facebook.com/groups/1496116444049224",
        title: "NASH",
        subtitle: "Facebookgruppe for alle studentorchesterne i Norge",
    }, {
        link: "https://www.facebook.com/groups/824108334919023",
        title: "SOT",
        subtitle: "Facebookgruppe for alle studentorchesterne i Trondheim",
    }, {
        link: "https://www.messenger.com/t/1795481677236473",
        title: "Facebook chat",
        subtitle: "Spør noen i motstanden for å bli med",
    }, {
        link: "https://www.snapchat.com/invite/NWM3NGQ4MjktODBlYS0zNTczLTk1MDctOWRkZTYyMWU5OGZl/MTM5ZDdmMmItMmVmMC1mMDRlLTM3NTUtMTRiMTA2ZjkyZDBm",
        title: "Snapchat",
        subtitle: "",
    }, {
        link: "https://discord.gg/Np3uAfS28V",
        title: "Discord",
        subtitle: "",
    }, {
        link: "https://www.instagram.com/denohmskemotstanden/",
        title: "Instagram",
        subtitle: "",
    }, {
        link: "https://www.tiktok.com/@denohmskemotstanden",
        title: "Tiktok",
        subtitle: "",
    }]

    return (
        <Grid item xs={12} sm={12} md={6} >
            <TitleCard
                title={title}
                sx={{ maxWidth: "600px", height: "100%" }}
            >
                <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                    {items.map((info) => (
                        <li key={info.link} style={{ marginBottom: "20px" }}>
                            <Link
                                color="secondary"
                                href={info.link}
                                underline="hover"
                            >
                                {info.title}
                            </Link>
                            <div style={{
                                paddingLeft: "10px",
                                opacity: 0.65,
                                fontSize: "small",
                            }}>
                                {info.subtitle}
                            </div>
                        </li>
                    ))}
                </ul>
            </TitleCard>
        </Grid>
    )
}


function ItemOfTheDay<T>({
    title,
    fetchUrl,
    renderSkeleton,
    renderItems,
    hide,
    xs,
    sm,
    md,
    display
}: {
    title: string,
    fetchUrl: string,
    renderSkeleton: React.ReactElement,
    renderItems: (props: RenderItemProps<T>) => React.ReactElement,
    hide?: boolean
    xs?: number,
    sm?: number,
    md?: number,
    display?: {xs?: string, sm?: string, md?: string, lg?: string, xl?: string}
}) {
    useTimeZone()   // Triggers rerender on time zone change 

    if(hide)
        return <></>

    return (
        <Grid item xs={xs ?? 12} sm={sm ?? 12} md={md ?? 6} display={display} >
            <TitleCard
                title={title}
                sx={{ maxWidth: "600px", height: "100%" }}>
                <ItemLoader<T>
                    queryKey={[`${title}: ${fetchUrl}`]}
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
    queryKey: QueryKey,
    fetchUrl: string,
    renderSkeleton: React.ReactElement,
    renderItems: (props: RenderItemProps<T>) => React.ReactElement
}) {

    const queryClient = useQueryClient()
    const onRefetchItems = () => queryClient.invalidateQueries({queryKey: queryKey})

    const { isPending, isError, data, error } = useQuery<T>({
        queryKey: queryKey,
        queryFn: fetchFn<T>(fetchUrl),
    })

    if (isPending) {
        return (
            <>
                {renderSkeleton}
            </>
        )
    }

    if (isError) {
        return <div style={{ minHeight: "100px" }}>{`${error}`}</div>
    }

    return (
        <>
            {renderItems({ items: data, refetchItems: onRefetchItems })}
        </>
    )
}
