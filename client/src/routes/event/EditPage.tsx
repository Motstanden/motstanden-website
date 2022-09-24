import React from "react";
import { useOutletContext } from "react-router-dom";
import { EventData } from "common/interfaces";
import { EventEditorForm, EventEditorState } from "./components/EventEditorForm";
import dayjs from "dayjs";


export function EditEventPage() {
    const event = useOutletContext<EventData>();
    let initialValue: EventEditorState ={
        title: event.title,
        startTime: dayjs(event.startDateTime),
        endTime: event.endDateTime ? dayjs(event.endDateTime) : null,
        keyInfo: event.keyInfo,
        description: event.description
    }
    return (
        <div style={{maxWidth: "900px"}}>
            <h1>
                <span>Redigerer </span> 
                <em><q>{event.title}</q></em>
            </h1>
            <EventEditorForm backUrl="/arrangement" postUrl="/api/events/update" initialValue={initialValue} eventId={event.eventId}/>
        </div>
    );
}
