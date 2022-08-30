import { Reducer, useCallback, useContext, useMemo, useReducer, useState } from "react"
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
import { Button, Divider, IconButton, SxProps, TextField } from "@mui/material"
import Stack from "@mui/system/Stack"
import { useNavigate } from "react-router-dom"
import { Toolbar } from "./RichTextEditor"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Form } from "src/components/form/Form"
import React from "react"

export function NewEventPage() {

    return (
        <>
            <h1>Nytt arrangement</h1> 
            <EventForm backUrl="/arrangement" postUrl="" initialValue={emptyEventObj}/>
        </>
    )   
}

const emptyEventObj: NewEvent = {
    title: "",
    startTime: null,
    endTime: null,
    extraInfo: [],
    content: [
        {
            type: ElementType.Paragraph,
            children: [{text: ""}]
        }
    ]
}

const EventStateContext = React.createContext<NewEvent>(null!) 
const EventDispatchContext = React.createContext<React.Dispatch<Partial<NewEvent>>>(null!)
function useEvent(): [NewEvent, React.Dispatch<Partial<NewEvent>>] {
    return [ useContext(EventStateContext), useContext(EventDispatchContext) ]
}

export function EventForm( {backUrl, postUrl, initialValue}: {backUrl: string, postUrl: string, initialValue: NewEvent} ) {

    const reducer = (state: NewEvent, newVal: Partial<NewEvent>): NewEvent => {
        return {...state, ...newVal}
    }

    const navigate = useNavigate()
    const [state, dispatch] = useReducer<Reducer<NewEvent, Partial<NewEvent>>>(reducer, initialValue)

    return (
        <Form 
            value={state}       // #TODO: Serialize state
            postUrl={postUrl}
            onAbortClick={ e => navigate(backUrl)}
        >
            <Paper elevation={6} sx={{px: 2, pb: 4, pt: 1}}>
                <EventStateContext.Provider value={state}>
                   <EventDispatchContext.Provider value={dispatch}>
                        <EventEditor/>
                    </EventDispatchContext.Provider> 
                </EventStateContext.Provider>
            </Paper> 
        </Form>
    )
}


function EventEditor(){
    // const editor = useMemo(() => withHistory(withHistory(withReact(createEditor()))), [])        // Production
    const [ event, dispatch] = useEvent()
    const [editor] = useState(withHistory(withReact(createEditor())))            // Development
    const renderElement = useCallback( (props: RenderElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback( (props: RenderLeafProps) => <Leaf {...props}/>, [])

    return (
        <Slate editor={editor}  value={event.content} onChange={ newVal => dispatch({content: newVal})}>
            <Toolbar/>
            <Divider sx={{mt: 1, mb: 4}}/>
            <EventInfoForm/>
            <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                placeholder="Beskrivelse av arrangementet*"
                onKeyDown={event => handleAllFormatHotkeys(editor, event)}
            />
        </Slate>
    )
}

function EventInfoForm(){
    return (
        <Stack sx={{mb: 6}}>
            <TitleForm sx={{mb: 4}}/>
            <TimeForm sx={{mb: 2}}/>
            <ExtraInfoForm/>
        </Stack>
    )
}

function TitleForm( { sx }: { sx?: SxProps } ) {
    const [ event, dispatch] = useEvent()
    return (
        <TextField
            variant="standard"
            placeholder="Tittel på arrangement*"
            autoComplete="off"
            required
            fullWidth
            value={event.title}
            onChange={e => dispatch({title: e.target.value})}
            InputProps={{ style: {fontSize: "1.5em", fontWeight: "bolder"}}}
            sx={sx}
        />
    )
}

function TimeForm({ sx }: {sx?: SxProps } ) {
    const today = dayjs()
    const [ event, dispatch] = useEvent()
    return (
        <Stack direction="row" alignItems="flex-end" sx={sx}>
            <DateTimePicker
                label="Starter"
                minDateTime={today}
                value={event.startTime}
                onChange={(newVal: Dayjs | null) => dispatch({startTime: newVal})}
                renderInput={ params => ( 
                    <>
                        <strong style={{minWidth: "110px", marginBottom: "5px"}}>Tidspunkt: </strong>
                        <TextField {...params} required autoComplete="off" variant="standard" style={{maxWidth: "180px"}}/> 
                    </>)}
                />
            <div style={{marginInline: "20px", marginBottom: "5px"}}>
                –
            </div>
            <DateTimePicker
                label="Slutter"
                disabled={!event.startTime}
                minDateTime={event.startTime ?? today}
                value={event.endTime}
                onChange={(newVal: Dayjs | null) => dispatch({endTime: newVal})}
                renderInput={ params => (
                    <>
                        <TextField {...params} required autoComplete="off" variant="standard" style={{maxWidth: "180px"}}/>
                    </>
                )}
                />
        </Stack>
    )   
}

function ExtraInfoForm() {
    const [event, dispatch] = useEvent()

    const onAddClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let newItems = [...event.extraInfo, {key: "", value: ""}]
        dispatch({extraInfo: newItems})
    }

    const onDeleteClick = (i: number) => {
        let newItems = [...event.extraInfo]
        newItems.splice(i, 1)
        dispatch({extraInfo: newItems})
    }

    const onValueChange = (i: number, newVal: ExtraInfo) => {
        let newItems = [...event.extraInfo]
        newItems[i] = newVal
        dispatch({extraInfo: newItems})
    }

    if(event.extraInfo.length === 0) {
        return ( 
            <div>
                <AddInfoButton onClick={onAddClick}/>
            </div>
        )
    }

    return (
        <Stack>
            {event.extraInfo.map( (item, index) => <ExtraInfoItem 
                key={index} 
                value={item} 
                onChange={ newVal => onValueChange(index, newVal)}
                onDeleteClick={() => onDeleteClick(index)} />
            )}
            <div>
                <AddInfoButton onClick={onAddClick}/>
            </div>
        </Stack>
    )
}

function ExtraInfoItem( {value, onChange, onDeleteClick }: {value: ExtraInfo, onChange: (info: ExtraInfo) => void,  onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return (
        <div>
            <TextField 
                value={value.key}
                required 
                sx={{mb: 4}}
                style={{maxWidth: "100px", marginRight: "10px"}}
                InputProps={{ style: {fontWeight: "bold"}}}
                variant="standard"
                placeholder="Tittel*"
                onChange={ e => onChange({...value, key: e.target.value})}
            />
            <TextField 
                value={value.value}
                required 
                variant="standard" 
                placeholder="info*" 
                onChange={ e => onChange({...value, value: e.target.value})}
            /> 
            <IconButton style={{marginLeft: "20px"}} onClick={onDeleteClick}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}


function AddInfoButton({onClick}: {onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return (
        <Button variant="outlined" endIcon={<AddIcon/>} size="small" onClick={onClick} >Info</Button>
        )
    }

interface NewEvent {
    title: string
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    extraInfo: ExtraInfo[]
    content: Descendant[]
}

interface ExtraInfo{ 
    key: string,
    value: string,
}