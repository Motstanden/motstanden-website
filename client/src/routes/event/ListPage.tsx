import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { EventData } from "common/interfaces";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { ItemMenu } from "./components/ItemMenu";
import { KeyInfo } from "./components/KeyInfo";
import { buildEventItemUrl } from "./Context";

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
                {events.map((e, index) => <EventItem key={`${index} ${e.title}}`} event={e} />)}
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