import { Link, Paper, Stack, Theme, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { EventData, Poll } from "common/interfaces"
import dayjs from "dayjs"
import { Link as RouterLink } from "react-router-dom"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { useDrawerWidth } from "src/layout/useAppSizes"
import { buildEventItemUrl } from "src/routes/event/Context"
import { fetchFn } from "src/utils/fetchAsync"
import { pollBaseQueryKey } from "../poll/Context"
import { Feed } from "./Feed/Feed"
import { TitleCard } from "src/components/TitleCard"
import { usePageContainerMargin } from "src/layout/PageContainer/usePageContainerMargin"
import { PollCard } from "../poll/components/PollCard"

export function HomePage() {
    useAppBarHeader("Hjem")
    useTitle(undefined)
    const defaultMargins = usePageContainerMargin()
    return (
        <PageContainer 
            disableGutters
            style={{
                paddingTop: defaultMargins.top,
                paddingBottom: defaultMargins.bottom,
                paddingLeft: "20px",
            }}
        >
            <PageContent/>
        </PageContainer>
    )
}

function PageContent() { 
    const isNarrow  = useMediaQuery( (theme: Theme) => theme.breakpoints.down('lg'))
    return isNarrow 
        ? <NarrowContent/> 
        : <WideContent/>
}

function NarrowContent() { 
    return (
        <Feed/>
    )
}

function WideContent() {
    return (
        <div style={{
            display: "flex",
        }}>
            <section style={{
                flexGrow: 1,
            }}>
                <Feed style={{marginInline: "auto"}}/>
            </section>
            <aside style={{
                flexGrow: 1,
                maxWidth: "500px",
                minWidth: "350px",
                marginLeft: "20px",
                marginRight: "20px"
            }}>
                <SideContent/>
            </aside>
        </div>
    )
}

function SideContent() { 
    return (
        <Stack direction="column" rowGap="30px">
            <UpcomingEvents/>  
            <LatestPoll />
        </Stack>
    )
}

function UpcomingEvents() { 
    const { data, isError, isPending, error } = useUpcomingEvents()

    if(isPending) {
        return <div>Loading...</div>
    }

    if(isError || data.length === 0) {
        return <></>
    }

    return (
        <TitleCard 
            title={data.length > 1 ? "Arrangementer" : "Arrangement"} 
            variant="outlined"
            sx={{
                width: "100%",
            }}
        >
            <ul style={{
                listStyle: "none",
                paddingLeft: "10px"
            }}
            >
                {data.map((event, index) => (
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
                            {dayjs.utc(event.startDateTime).tz().format("dddd D. MMM [kl]: HH:mm")}
                        </div>
                    </li>
                ))}
            </ul>
        </TitleCard>
    )
}

function useUpcomingEvents() {
    return useQuery({
        queryKey: ["events", "upcoming"],
        queryFn: fetchFn<EventData[]>("/api/events?filter=upcoming"),
    })
}

function LatestPoll() {
    const { data, isError, isPending, error } = useLatestPoll()

    if(isPending) {
        return <div>Loading...</div>
    }

    if(isError || !data) {
        return <></>
    }

    return (
        <PollCard poll={data} variant="outlined"/>
    )
}

function useLatestPoll() {
    return useQuery({
        queryKey: [...pollBaseQueryKey, "latest"],
        queryFn: fetchFn<Poll>("/api/polls/latest"),
    })
}