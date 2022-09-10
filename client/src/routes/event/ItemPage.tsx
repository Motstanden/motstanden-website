import React from "react";
import { Divider, Link, Paper, Stack } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { EventData } from "common/interfaces";
import DOMPurify from "dompurify";
import { ItemMenu, KeyValueList, formatTimeInfo } from "./EventList";
import dayjs from "dayjs";
import {Link as RouterLink} from "react-router-dom"

export function ItemPage() {
    const event = useOutletContext<EventData>();
    return (
        <>
            <Paper elevation={6} sx={{ p: 2, pt: 0, mt: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop={3}
                    paddingTop={2}
                >
                    <h1 style={{ margin: 0 }}>{event.title}</h1>
                    <ItemMenu event={event} iconOrientation="vertical" />
                </Stack>
                <Divider />
                <AuthorList event={event} />
                <KeyValueList
                    style={{
                        margin: "0px",
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}
                    items={[
                        {
                            key: "Tid:",
                            value: formatTimeInfo(event.startDateTime, event.endDateTime)
                        },
                        ...event.keyInfo
                    ]} />
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }} />
            </Paper>
        </>
    );
}

function AuthorList({event}: {event: EventData}) {
    return (
        <div style={{
            fontSize: "xx-small", 
            opacity: 0.75, 
            paddingBlock: "10px",
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "5px",
            rowGap: "4px"
        }}>
            <div>
                Opprettet:
            </div>
            <div>
                <AuthorItem userName={event.createdByName} userId={event.createdByUserId} dateTime={event.createdAt}/>
            </div>
            {event.createdAt !== event.updatedAt && (
                <>
                    <div>
                        Redigert:
                    </div>
                    <div>
                        <AuthorItem userName={event.updatedByName} userId={event.updatedByUserId} dateTime={event.updatedAt}/>
                    </div>
                </>
            )}
        </div>
    )
} 

function AuthorItem({ userName, userId, dateTime }: {userName: string, userId: number, dateTime: string}) {
    return(
        <span>
            {`${dayjs(dateTime).format("DD. MMM YYYY HH:mm")}, av `}
            <Link 
                color="secondary" 
                component={RouterLink}
                to={`/medlem/${userId}`}
                underline="hover"
                >
                {`${userName}`}
            </Link>
        </span>
    )
}