import { EventEditorForm, EventEditorState } from "./components/EventEditorForm"


export default function NewEventPage() {

    return (
        <div style={{ maxWidth: "900px" }}>
            <h1>Nytt arrangement</h1>
            <EventEditorForm 
                storageKey={["Event", "New"]}
                postUrl="/api/events/new" 
                initialValue={emptyEventObj} 
            />
        </div>
    )
}

const emptyEventObj: EventEditorState = {
    title: "",
    startTime: null,
    endTime: null,
    keyInfo: [],
    description: ""
}