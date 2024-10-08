import {
    Divider,
    MenuItem,
    Paper,
    Stack,
    TextField
} from "@mui/material"
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType, ParticipationStatus } from "common/enums"
import { EventData, Participant, UpsertParticipant } from "common/interfaces"
import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { AuthorInfo } from "src/components/AuthorInfo"
import { CommentSection } from "src/components/CommentSection"
import { TitleCard } from "src/components/TitleCard"
import { UserList } from "src/components/UserList"
import { useAuthenticatedUser } from "src/context/Authentication"
import { useTitle } from "src/hooks/useTitle"
import { fetchFn } from "src/utils/fetchAsync"
import { putJson } from "src/utils/postJson"
import { MarkDownRenderer } from "../../components/MarkDownEditor"
import { eventContextQueryKey } from "./Context"
import { ItemMenu } from "./components/ItemMenu"
import { KeyInfo } from "./components/KeyInfo"
import { EventParticipationSkeleton } from "./skeleton/ItemPage"

export default function ItemPage() {
    const event = useOutletContext<EventData>();
    useTitle(event.title)

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const onDeleteSuccess = () => {
        queryClient.invalidateQueries({queryKey: eventContextQueryKey})
        navigate("./..")
    }

    return (
        <div style={{ maxWidth: "1000px" }}>

            <Paper elevation={6} sx={{ p: 2, pt: 0, mt: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop={3}
                    paddingTop={2}
                >
                    <h1 style={{ margin: 0 }}>{event.title}</h1>
                    <ItemMenu 
                        event={event} 
                        iconOrientation="vertical" 
                        onDeleteSuccess={onDeleteSuccess}
                    />
                </Stack>
                <Divider />
                <AuthorInfo 
                    createdAt={event.createdAt}
                    createdByUserId={event.createdBy}
                    updatedAt={event.updatedAt}
                    updatedByUserId={event.updatedBy}
                />
                <KeyInfo
                    keyInfo={event.keyInfo}
                    startTime={event.startDateTime}
                    endTime={event.endDateTime}
                    style={{
                        margin: "0px",
                        marginTop: "20px",
                        marginBottom: "20px"
                    }}
                />
                <MarkDownRenderer value={event.description} />
            </Paper>
            <Divider sx={{ my: 4 }} />
            <ParticipationContainer eventId={event.id} />
            <Divider sx={{ my: 4 }} />
            <CommentSection 
                entityType={CommentEntityType.Event}
                entityId={event.id}            
            />
        </div>
    );
}

function ParticipationContainer({ eventId }: { eventId: number }) {
    const queryKey = ["FetchEvenParticipants", eventId]
    const { isPending, isError, data, error } = useQuery<Participant[]>({
        queryKey: queryKey,
        queryFn: fetchFn<Participant[]>(`/api/events/${eventId}/participants`),
    })
    
    const { user } = useAuthenticatedUser()

    if (isPending) {
        return <EventParticipationSkeleton/>
    }

    if (isError) {
        return <div>{`${error}`}</div>
    }

    const currentUserStatus = data.find(participant => participant.id === user.id)

    const attending = data.filter(user => user.status === ParticipationStatus.Attending)
    const maybeAttending = data.filter(user => user.status === ParticipationStatus.Maybe)
    const notAttending = data.filter(user => user.status === ParticipationStatus.NotAttending)

    return (
        <>
            <AttendingForm eventId={eventId} queryKey={queryKey} status={currentUserStatus?.status} />
            <AttendingList title="Deltar" items={attending} />
            <AttendingList title="Deltar kanskje" items={maybeAttending} />
            <AttendingList title="Deltar ikke" items={notAttending} />
        </>
    )
}

function AttendingForm({ 
    eventId, 
    queryKey, 
    status = ParticipationStatus.Unknown,
}: { 
    eventId: number, 
    queryKey: QueryKey, 
    status?: ParticipationStatus 
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const queryClient = useQueryClient()

    const changeHandler = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsSubmitting(true)
        const newVal: UpsertParticipant = {
            status: e.target.value as ParticipationStatus 
        }
        const response = await putJson(`/api/events/${eventId}/participants/me`, newVal, { alertOnFailure: true })

        if (response && response.ok) {
            await queryClient.invalidateQueries({ queryKey: queryKey })
        }
        setIsSubmitting(false)
    }

    return (
        <div style={{ maxWidth: "450px" }}>
            <Paper sx={{ py: 4, px: 4 }} elevation={6} >
                <TextField
                    select
                    label="Min status"
                    value={status}
                    style={{ width: "100%" }}
                    onChange={changeHandler}
                    disabled={isSubmitting}
                    helperText={status === ParticipationStatus.Unknown ? "Jeg vil ikke svare..." : `Jeg ${status.toLowerCase()} på arrangementet...`}
                    FormHelperTextProps={{ style: { opacity: 0.7 } }}
                >
                    <MenuItem value={ParticipationStatus.Unknown}>——————</MenuItem>
                    <MenuItem value={ParticipationStatus.Attending}>{`${ParticipationStatus.Attending}`}</MenuItem>
                    <MenuItem value={ParticipationStatus.Maybe}>{`${ParticipationStatus.Maybe}`}</MenuItem>
                    <MenuItem value={ParticipationStatus.NotAttending}>{`${ParticipationStatus.NotAttending}`}</MenuItem>
                </TextField>
            </Paper>
        </div>
    )
}

function AttendingList({ title, items }: { title: string, items: Participant[] }) {
    if (items.length === 0) {
        return <></>
    }
    return (
        <TitleCard title={title} sx={{ my: 6 }}>
            <UserList users={items}/>
        </TitleCard>
    )
}