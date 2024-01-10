import {
    Link,
    Paper,
    Stack
} from "@mui/material";
import { EventData } from "common/interfaces";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { buildEventItemUrl } from "./Context";
import { ItemMenu } from "./components/ItemMenu";
import { KeyInfo } from "./components/KeyInfo";

export default function EventListPage({ mode }: { mode?: "upcoming" | "previous" | "all" }) {
    useTitle("Arrangement")

    let events = useOutletContext<EventData[]>()
    if (mode === "upcoming")
        events = events.filter(e => e.isUpcoming)

    if (mode === "previous")
        events = events.filter(e => !e.isUpcoming)

    return (
        <>
            <h1>Arrangement</h1>
            <div style={{ maxWidth: "650px" }}>
                {events.map( e => (
                    <EventItem key={e.eventId} event={e} />
                ))}
                
                {events.length <= 0 && 
                    <span style={{opacity: 0.75 }}>Ingen kommende arrangementer...</span>
                }
            </div>
        </>
    )
}

function EventItem({ event }: { event: EventData }) {
    return (
        <Paper sx={{ mb: 4, p: 2, pt: 1.5 }} elevation={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <h3 style={{ margin: 0 }}>
                    <Link
                        color="secondary"
                        component={RouterLink}
                        to={buildEventItemUrl(event)}
                        underline="hover"
                    >
                        {event.title}
                    </Link>

                </h3>
                <ItemMenu event={event} />
            </Stack>
            <KeyInfo keyInfo={event.keyInfo} startTime={event.startDateTime} endTime={event.endDateTime} />
        </Paper>
    )
}