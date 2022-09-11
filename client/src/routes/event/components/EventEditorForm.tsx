import React, { Reducer, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { Leaf } from "src/components/TextEditor/Leaf"
import { Element } from "src/components/TextEditor/Element"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { createEditor, Descendant, Editor } from "slate"
import { handleAllFormatHotkeys } from "src/components/TextEditor/Hotkey"
import { CustomEditor, ElementType } from "src/components/TextEditor/Types"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers"
import { Button, Divider, IconButton, InputAdornment, Paper, SxProps, TextField } from "@mui/material"
import { TextFieldProps } from "@mui/material/TextField";
import Stack from "@mui/system/Stack"
import { Toolbar } from "./RichTextEditor"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { KeyValuePair, UpsertEventData } from "common/interfaces"
import { useNavigate } from "react-router-dom"
import { serialize } from "src/components/TextEditor/HtmlSerialize"
import { Form } from "src/components/form/Form"

export interface EventEditorState {
    title: string
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    extraInfo: KeyValuePair<string, string>[]
    content: Descendant[]
}

export function EventEditorForm({ backUrl, postUrl, initialValue, eventId }: { backUrl: string; postUrl: string; initialValue: EventEditorState; eventId?: number; }) {

    const reducer = (state: EventEditorState, newVal: Partial<EventEditorState>): EventEditorState => {
        return { ...state, ...newVal };
    };

    const navigate = useNavigate();
    const [state, dispatch] = useReducer<Reducer<EventEditorState, Partial<EventEditorState>>>(reducer, initialValue);

    const serializeState = (): UpsertEventData => {
        const serializedEvent: UpsertEventData = {
            eventId: eventId,
            title: state.title,
            startDateTime: state.startTime!.format("YYYY-MM-DD HH:MM:00"),
            endDateTime: state.endTime?.format("YYYY-MM-DD HH:MM:00") ?? null,
            keyInfo: state.extraInfo,
            description: serialize(state.content)
        };
        return serializedEvent;
    };

    const onPostSuccess = async (res: Response) => {
        const data = await res.json();
        window.location.href = `${window.location.origin}/arrangement/${data.eventId ?? ""}`; // Will trigger a page reload
    };

    return (
        <Form
            value={serializeState}
            postUrl={postUrl}
            onAbortClick={e => navigate(backUrl)}
            onPostSuccess={onPostSuccess}
        >
            <Paper elevation={6} sx={{ px: 2, pb: 4, pt: 1 }}>
                <EventStateContext.Provider value={state}>
                    <EventDispatchContext.Provider value={dispatch}>
                        <EventEditor />
                    </EventDispatchContext.Provider>
                </EventStateContext.Provider>
            </Paper>
        </Form>
    );
}

const EventStateContext = React.createContext<EventEditorState>(null!) 
const EventDispatchContext = React.createContext<React.Dispatch<Partial<EventEditorState>>>(null!)
function useEvent(): [EventEditorState, React.Dispatch<Partial<EventEditorState>>] {
    return [ useContext(EventStateContext), useContext(EventDispatchContext) ]
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
                        <TextField {...params} autoComplete="off" variant="standard" style={{maxWidth: "180px"}}/>
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

    const onValueChange = (i: number, newVal: KeyValuePair<string, string>) => {
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

function ExtraInfoItem({
    value, 
    onChange, 
    onDeleteClick 
}: {
    value: KeyValuePair<string, string>, 
    onChange: (info: KeyValuePair<string, string>) => void,  
    onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>}
) {
    const maxKeyChars = 16
    const maxValueChars = 100

    useEffect( () => {
        if(value.key.length > maxKeyChars || value.value.length > maxValueChars) {
            onChange({
                key: value.key.slice(0, maxKeyChars),
                value: value.value.slice(0, maxValueChars) 
            })
        }
    }, [value.key, value.value])

    const sharedProps: TextFieldProps = {
        required: true,
        sx: {mb: 4},
        variant: "standard",
        FormHelperTextProps: {
            style: {
                opacity: 0.8
            }
        }
    }

    return (
        <div>
            <TextField 
                {...sharedProps}
                value={value.key}
                style={{maxWidth: "100px", marginRight: "10px"}}
                variant="standard"
                placeholder="Tittel*"
                onChange={ e => onChange({...value, key: e.target.value})}
                helperText={value.key.length === 0 ? "F.eks. Sted:" : `${value.key.length}/${maxKeyChars}`}
                inputProps={{
                    maxLength: maxKeyChars,
                    style: {
                        fontWeight: "bold"
                    }
                }}
            />
            <TextField 
                {...sharedProps}
                value={value.value}
                placeholder="info*" 
                onChange={ e => onChange({...value, value: e.target.value})}
                helperText={value.value.length === 0 ? "F.eks. Bergstua" : `${value.value.length}/${maxValueChars}`}
                inputProps={{
                    maxLength: maxValueChars,
                }}
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