import React from "react";
import { Divider, Link, Paper, Stack, Avatar } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { EventData, Participant, ParticipationList } from "common/interfaces";
import DOMPurify from "dompurify";
import { ItemMenu } from "./components/ItemMenu";
import dayjs from "dayjs";
import { KeyInfo } from "./components/KeyInfo";
import {Link as RouterLink} from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchAsync } from "src/utils/fetchAsync";
import { ParticipationStatus } from "common/enums";
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace";
import { TitleCard } from "src/components/TitleCard";

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
                <KeyInfo 
                    keyInfo={event.keyInfo}
                    startTime={event.startDateTime}
                    endTime={event.endDateTime}
                    style={{
                        margin: "0px",
                        marginTop: "30px",
                        marginBottom: "30px"
                    }}
                />
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }} />
            </Paper>
            <Divider sx={{my: 4}}/>
            <ParticipationContainer eventId={event.eventId}/>
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

function ParticipationContainer( {eventId}: {eventId: number}) {
    const {isLoading, isError, data, error} = useQuery<ParticipationList>(["FetchEvenParticipants", eventId], () => fetchAsync<ParticipationList>(`/api/event-participants?eventId=${eventId}`) )
    
    if (isLoading) {
        return <></>
    }
    
    if (isError) {
        return <div>{`${error}`}</div>
    }

    const attending = data.participants.filter( user => user.participationStatus === ParticipationStatus.Attending) 
    const maybeAttending = data.participants.filter( user => user.participationStatus === ParticipationStatus.Maybe) 
    const notAttending = data.participants.filter( user => user.participationStatus === ParticipationStatus.NotAttending) 

    return (
        <>
            <AttendingList title="Deltar" items={attending}/>
            <AttendingList title="Deltar kanskje" items={maybeAttending}/>
            <AttendingList title="Deltar ikke" items={notAttending}/>
        </>
    )
}

function AttendingList({title, items}: {title: string, items: Participant[]}) {
    if(items.length === 0) {
        return <></>
    }
    return (
        <TitleCard title={title} sx={{my: 6}}>
            {items.map( (user, index) => (
                <Stack 
                    key={user.userId}
                    direction="row" 
                    alignItems="center" 
                    sx={{py: 1, pl: 1}} 
                    spacing={2} 
                    borderRadius="7px"
                    bgcolor={index % 2 === 1 ? "action.hover" : "transparent"}
                >
                        <Avatar>{user.firstName[0] + user.lastName[0]}</Avatar>
                        <Link 
                            color="secondary" 
                            component={RouterLink}
                            to={`/medlem/${user.userId}`}
                            underline="hover"
                            >
                            {`${user.firstName} ${isNullOrWhitespace(user.middleName) ? user.lastName : user.middleName + " " + user.lastName}`}
                        </Link>
                    </Stack>
                )
                )}
        </TitleCard>
    )
}