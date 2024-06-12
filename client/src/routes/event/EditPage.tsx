import { EventData } from "common/interfaces";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import { EventEditorForm, EventEditorState } from "./components/EventEditorForm";


export default function EditEventPage() {
    const event = useOutletContext<EventData>();
    const initialValue: EventEditorState = {
        title: event.title,
        startTime: dayjs.utc(event.startDateTime),
        endTime: event.endDateTime ? dayjs.utc(event.endDateTime) : null,
        keyInfo: event.keyInfo,
        description: event.description
    }
    return (
        <div style={{ maxWidth: "1000px" }}>
            <h1>
                <span>Redigerer </span>
                <em><q>{event.title}</q></em>
            </h1>
            <EventEditorForm 
                storageKey={["Event", "Edit", event.id]}
                postUrl="/api/events/update" 
                initialValue={initialValue} eventId={event.id} 
            />
        </div>
    );
}
