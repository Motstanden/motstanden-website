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
        type: ElementType.H1,
        children: [{text: "", placeholder: "Tittel på arrangement..."}]
    }, {
        type: ElementType.EditableVoid,
        children: [{text: ""}]

    }, {
        type: ElementType.Paragraph,
        children: [{text: "", placeholder: "Beskrivelse av arrangement..."}]
    }
]


function EventEditor(){
    // const editor = useMemo(() => withHistory(withTitle(withEditableVoids(withReact(createEditor())))), [])        // Production
    const [editor] = useState(withHistory(withTitle(withEditableVoids(withReact(createEditor())))))            // Development
    const renderElement = useCallback( (props: RenderElementProps) => props.element.type === ElementType.EditableVoid ? <TimeForm/> : <Element {...props} />, [])
    const renderLeaf = useCallback( (props: RenderLeafProps) => <Leaf {...props}/>, [])

    return (
        <Slate editor={editor}  value={initialValue}>
            <Toolbar/>
            <Divider sx={{mt: 1}}/>
            <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                placeholder={`\nDette skal ikke være mulig! 😲\n\nCtrl + z for å gå tilbake.\n`}
                onKeyDown={event => handleAllFormatHotkeys(editor, event)}
            />
        </Slate>
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
                        <TextField {...params} variant="standard" style={{maxWidth: "160px"}}/> 
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


function KeyInfoItem( {key, info}: {key: string, info: string}) {
    return (
        <div>
            <strong style={{minWidth: "110px"}} >{key + ": "}</strong> {info}
        </div>

    )
}

function withTitle(editor: CustomEditor): CustomEditor {
    const { normalizeNode } = editor

    editor.normalizeNode = (entry) => {
        const [node, path] = entry    
        
        if(path.length === 0) { // is first child
            if(editor.children.length === 1) {
                console.log("no children")
            }
        }
    }

    return editor
}

function withEditableVoids(editor: CustomEditor) {
    const { isVoid } = editor
  
    editor.isVoid = element => {
      return element.type === ElementType.EditableVoid ? true : isVoid(element)
    }
  
    return editor
  }