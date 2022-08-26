import { useCallback, useMemo, useState } from "react"
import { Leaf } from "src/components/TextEditor/Leaf"
import { Element } from "src/components/TextEditor/Element"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { createEditor, Descendant, Editor } from "slate"
import { handleAllFormatHotkeys } from "src/components/TextEditor/Hotkey"
import { CustomEditor, ElementType } from "src/components/TextEditor/Types"
import Paper from "@mui/material/Paper"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers"
import { Divider, TextField } from "@mui/material"
import Stack from "@mui/system/Stack"
import SubmitFormButtons from "src/components/SubmitFormButtons"
import { useNavigate } from "react-router-dom"
import { Toolbar } from "./RichTextEditor"

export function NewEventPage() {
    const navigate = useNavigate()

    return (
        <>
            <h1>Nytt arrangement</h1> 
            <form>
                <Paper elevation={6} sx={{px: 2, pb: 2, pt: 1}}>
                    <EventEditor/>
                </Paper>  
                <div style={{marginTop: "50px"}}>
                    <SubmitFormButtons onAbort={e => navigate("/arrangement")}/>
                </div>
            </form>
        </>
    )   
}

const initialValue: Descendant[] = [
    {
        type: ElementType.Paragraph,
        children: [{text: ""}]
    }
]


function EventEditor(){
    const editor = useMemo(() => withHistory(withHistory(withReact(createEditor()))), [])        // Production
    // const [editor] = useState(withHistory(withReact(createEditor())))            // Development
    const renderElement = useCallback( (props: RenderElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback( (props: RenderLeafProps) => <Leaf {...props}/>, [])

    return (
        <Slate editor={editor}  value={initialValue}>
            <Toolbar/>
            <Divider sx={{mt: 1, mb: 4}}/>
            <EventInfoForm/>
            <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                placeholder="Beskrivelse av arrangementet"
                onKeyDown={event => handleAllFormatHotkeys(editor, event)}
            />
        </Slate>
    )
}

function EventInfoForm(){
    return (
        <Stack spacing={4} sx={{mb: 6}}>
            <TitleForm/>
            <TimeForm/>
        </Stack>
    )
}

function TitleForm() {
    const [title, setTitle] = useState("")
    return (
        <TextField
            variant="standard"
            placeholder="Tittel på arrangement"
            autoComplete="off"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            InputProps={{ style: {fontSize: "1.5em", fontWeight: "bolder"}}}
        />
    )
}

function TimeForm() {
    const today = dayjs()
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)
    return (
        <Stack direction="row" alignItems="flex-end" sx={{mb: 5}} contentEditable={false}>
            <DateTimePicker
                label="Starter"
                minDateTime={today}
                value={startDate}
                onChange={(newVal: Dayjs | null) => setStartDate(newVal)}
                renderInput={ params => ( 
                    <>
                        <strong style={{minWidth: "110px", marginBottom: "5px"}}>Tidspunkt: </strong>
                        <TextField {...params} required variant="standard" style={{maxWidth: "160px"}}/> 
                    </>)}
                />
            <div style={{marginInline: "20px", marginBottom: "5px"}}>
                –
            </div>
            <DateTimePicker
                label="Slutter"
                disabled={!startDate}
                minDateTime={startDate ?? today}
                value={endDate}
                onChange={(newVal: Dayjs | null) => setEndDate(newVal)}
                renderInput={ params => (
                    <>
                        <TextField {...params} required variant="standard" style={{maxWidth: "160px"}}/>
                    </>
                )}
                />
        </Stack>
    )   
}
