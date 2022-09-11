import { ElementType } from "src/components/TextEditor/Types"
import { EventEditorForm, EventEditorState } from "./components/EventEditorForm"

export function NewEventPage() {

    return (
        <>
            <h1>Nytt arrangement</h1> 
            <EventEditorForm backUrl="/arrangement" postUrl="/api/events/new" initialValue={emptyEventObj}/>
        </>
    )   
}

const emptyEventObj: EventEditorState = {
    title: "",
    startTime: null,
    endTime: null,
    keyInfo: [],
    description: [
        {
            type: ElementType.Paragraph,
            children: [{text: ""}]
        }
    ]
}