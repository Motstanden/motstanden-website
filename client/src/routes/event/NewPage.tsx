import { emptyRichText } from "src/components/TextEditor/Assets"
import { EventEditorForm, EventEditorState } from "./components/EventEditorForm"

export function NewEventPage() {

    return (
        <div style={{ maxWidth: "900px" }}>
            <h1>Nytt arrangement</h1>
            <EventEditorForm backUrl="/arrangement" postUrl="/api/events/new" initialValue={emptyEventObj} />
        </div>
    )
}

const emptyEventObj: EventEditorState = {
    title: "",
    startTime: null,
    endTime: null,
    keyInfo: [],
    description: emptyRichText
}