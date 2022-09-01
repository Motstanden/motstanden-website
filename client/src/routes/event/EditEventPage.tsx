import React from "react";
import { useOutletContext } from "react-router-dom";
import { EventData } from "common/interfaces";
import { EventForm, EventEditorState } from "./NewEvent";
import dayjs from "dayjs";
import { ElementType } from "src/components/TextEditor/Types";


export function EditEventPage() {
    const event = useOutletContext<EventData>();
    let initialValue: EventEditorState ={
        title: event.title,
        startTime: dayjs(event.startDateTime),
        endTime: event.endDateTime ? dayjs(event.endDateTime) : null,
        extraInfo: event.keyInfo,
        content: [
            {
                type: ElementType.Paragraph,
                children: [{text: ""}]
            }
        ]   //TODO: Deserialize html
        // content: [] //TODO: Deserialize html
    }
    return (
        <>
            <h1>
                <span>Redigerer </span> 
                <em><q>{event.title}</q></em>
            </h1>
            <EventForm backUrl="/arrangement" postUrl="/api/events/update" initialValue={initialValue} />
        </>
    );
}
