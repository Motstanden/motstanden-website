import React from "react";
import { useOutletContext } from "react-router-dom";
import { EventData } from "common/interfaces";
import { EventEditorForm, EventEditorState } from "./components/EventEditorForm";
import dayjs from "dayjs";
import { deserialize } from "src/components/TextEditor/HtmlSerialize";


export function EditEventPage() {
    const event = useOutletContext<EventData>();
    let initialValue: EventEditorState ={
        title: event.title,
        startTime: dayjs(event.startDateTime),
        endTime: event.endDateTime ? dayjs(event.endDateTime) : null,
        extraInfo: event.keyInfo,
        content: deserialize(event.description)
    }
    return (
        <>
            <h1>
                <span>Redigerer </span> 
                <em><q>{event.title}</q></em>
            </h1>
            <EventEditorForm backUrl="/arrangement" postUrl="/api/events/update" initialValue={initialValue} eventId={event.eventId}/>
        </>
    );
}
