import React, { Reducer, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { Leaf } from "src/components/TextEditor/Leaf"
import { Element } from "src/components/TextEditor/Element"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { createEditor, Descendant, Editor, Text } from "slate"
import { handleAllFormatHotkeys } from "src/components/TextEditor/Hotkey"
import { CustomEditor, ElementType, FormattedText, ListItemElement } from "src/components/TextEditor/Types"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers"
import { Box, Button, Divider, IconButton, InputAdornment, Paper, SxProps, TextField, Theme, useMediaQuery } from "@mui/material"
import { TextFieldProps } from "@mui/material/TextField";
import Stack from "@mui/system/Stack"
import { EditorToolbar } from "./EditorToolbar"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { KeyValuePair, UpsertEventData } from "common/interfaces"
import { useNavigate } from "react-router-dom"
import { serialize } from "src/components/TextEditor/HtmlSerialize"
import { Form } from "src/components/form/Form"
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace"

export interface EventEditorState {
    title: string
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    keyInfo: KeyValuePair<string, string>[]
    description: Descendant[]
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
            keyInfo: state.keyInfo,
            description: serialize(state.description)
        };
        return serializedEvent;
    };

    const onPostSuccess = async (res: Response) => {
        const data = await res.json();
        window.location.href = `${window.location.origin}/arrangement/${eventId ?? data.eventId ?? ""}`;   // Will trigger a page reload
    };

    const editorHasContent = (): boolean =>  {

        let queue: Descendant[] = [ ...state.description ] 
        while(queue.length > 0) {
            const child = queue.pop()

            if(!child) {
                continue
            }

            const isText = Text.isText(child)
            if(isText && !isNullOrWhitespace(child.text)) {
                return true
            }

            if(!isText){
                queue = queue.concat(child.children)
            }
        }
        return false
    }

    const validateState = () => {
        const isValidTitle = !isNullOrWhitespace(state.title)
        const isValidStartTime = state.startTime && state.startTime.isValid()
        const isValidEndTime = state.endTime ? state.endTime.isValid() : true
        const isValidKeyInfo = !state.keyInfo.find(item => item.key.length === 0 || item.value.length === 0)

        return isValidTitle && isValidStartTime && isValidEndTime && isValidKeyInfo && editorHasContent() 
    }

    const isStateValid = useMemo( () => validateState(), [{...state}])    

    return (
        <Form
            value={serializeState}
            postUrl={postUrl}
            onAbortClick={e => navigate(backUrl)}
            onPostSuccess={onPostSuccess}
            disabled={!isStateValid}
        >
            <Paper elevation={6} sx={{ px: 2, pb: 4, pt: 3 }}>
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
    const editor = useMemo(() => withHistory(withHistory(withReact(createEditor()))), [])        // Production
    // const [editor] = useState(withHistory(withReact(createEditor())))                         // Development
    const [ event, dispatch] = useEvent()
    const renderElement = useCallback( (props: RenderElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback( (props: RenderLeafProps) => <Leaf {...props}/>, [])

    return (
        <Slate editor={editor}  value={event.description} onChange={ newVal => dispatch({description: newVal})}>
            <EventInfoForm/>
            <div style={{border: "1px solid gray"}}>
                <div style={{borderBottom: "1px solid #888888"}}>
                    <EditorToolbar/>
                </div>
                <div style={{minHeight: "100px", padding: "10px"}}>
                    <Editable 
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        spellCheck
                        placeholder="Beskrivelse av arrangementet*"
                        onKeyDown={event => handleAllFormatHotkeys(editor, event)}
                        />
                </div>
            </div>
        </Slate>
    )
}

function EventInfoForm(){
    return (
        <Stack sx={{mb: 6}}>
            <TitleForm sx={{mb: 4}}/>
            <TimeForm sx={{mb: {xs: 4, sm: 2}}}/>
            <KeyInfoForm/>
        </Stack>
    )
}

function TitleForm( { sx }: { sx?: SxProps } ) {
    const [ event, dispatch] = useEvent()
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <TextField
            variant="standard"
            placeholder="Tittel på arrangement*"
            autoComplete="off"
            required
            fullWidth
            value={event.title}
            onChange={e => dispatch({title: e.target.value})}
            InputProps={{ style: {fontSize: isSmallScreen ? "1.25em" : "1.5em", fontWeight: "bolder"}}}
            sx={sx}
        />
    )
}

const beginningOfTime = dayjs("2018-09-11")  // Motstandens birth day

function TimeForm({ sx }: {sx?: SxProps } ) {
    const today = dayjs()
    const [ event, dispatch] = useEvent()
    const textFieldProps: TextFieldProps = {
        autoComplete: "off", 
        variant: "standard", 
        fullWidth: true, 
        sx: {
            maxWidth: {xs: "100%", sm: "180px"}
        }
    }
    return (
        <Stack direction={{xs: "column", sm: "row"}} alignItems={{xs: "top", sm: "flex-end"}} sx={sx}>
            <Box sx={{
                minWidth: "145px", 
                marginBottom: {xs: "-5px", sm: "5px"}
            }}>
                <strong >
                    Tidspunkt: 
                </strong>
            </Box>
            <DateTimePicker
                label="Starter"
                minDateTime={beginningOfTime}
                defaultCalendarMonth={dayjs()}
                value={event.startTime}
                onChange={(newVal: Dayjs | null) => dispatch({startTime: newVal})}
                renderInput={ params => ( 
                    <>
                        <TextField {...params} {...textFieldProps} required/> 
                    </>)}
                />
            <Box display={{xs: "none", sm: "inline"}} style={{marginInline: "20px", marginBottom: "5px"}}>
                –
            </Box>
            <DateTimePicker
                label="Slutter"
                disabled={!event.startTime}
                minDateTime={event.startTime ?? beginningOfTime}
                value={event.endTime}
                onChange={(newVal: Dayjs | null) => dispatch({endTime: newVal})}
                renderInput={ params => (
                    <>
                        <TextField {...params} {...textFieldProps} />
                    </>
                )}
                />
        </Stack>
    )   
}

function KeyInfoForm() {
    const [event, dispatch] = useEvent()

    const onAddClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let newItems = [...event.keyInfo, {key: "", value: ""}]
        dispatch({keyInfo: newItems})
    }

    const onDeleteClick = (i: number) => {
        let newItems = [...event.keyInfo]
        newItems.splice(i, 1)
        dispatch({keyInfo: newItems})
    }

    const onValueChange = (i: number, newVal: KeyValuePair<string, string>) => {
        let newItems = [...event.keyInfo]
        newItems[i] = newVal
        dispatch({keyInfo: newItems})
    }

    if(event.keyInfo.length === 0) {
        return ( 
            <div style={{marginTop: "30px"}}>
                <AddInfoButton onClick={onAddClick}/>
            </div>
        )
    }

    return (
        <Stack>
            {event.keyInfo.map( (item, index) => <KeyInfoItem 
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

function KeyInfoItem({
    value, 
    onChange, 
    onDeleteClick 
}: {
    value: KeyValuePair<string, string>, 
    onChange: (info: KeyValuePair<string, string>) => void,  
    onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>}
) {
    const [randomExample, setRandomExample] = useState(keyValueExample[Math.floor(Math.random() * keyValueExample.length)])
    const maxKeyChars = 16
    const maxValueChars = 100
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
        variant: "standard",
        FormHelperTextProps: {
            style: {
                opacity: 0.8
            }
        }
    }

    return (
        <div 
            style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen ?  "auto min-content" : "min-content auto min-content max-content",
                columnGap: "15px",
                marginBottom: "30px",
                width: "100%"
            }}
        >
            <TextField 
                {...sharedProps}
                value={value.key}
                style={{minWidth: "130px"}}
                variant="standard"
                placeholder="Tittel*"
                onChange={ e => onChange({...value, key: e.target.value})}
                helperText={value.key.length === 0 ? `${randomExample.key}` : `${value.key.length}/${maxKeyChars}`}
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
                style={{width: "100%"}}
                onChange={ e => onChange({...value, value: e.target.value})}
                helperText={value.value.length === 0 ? `${randomExample.value}` : `${value.value.length}/${maxValueChars}`}
                inputProps={{
                    maxLength: maxValueChars,
                }}
            /> 
            <IconButton 
                style={{
                    width: "min-content",
                    height: "min-content",
                    margin: "auto",
                    gridColumn: isSmallScreen ? "2" : "3 ",
                    gridRow: isSmallScreen  ? "1 / 3" : "1"
                    
                }} 
                onClick={onDeleteClick}>
                    <DeleteIcon color="error"/>
            </IconButton>
        </div>
    )
}

const keyValueExample: KeyValuePair<string, string>[] = [
    { key: "Sted:", value: "Bergstua" },
    { key: "Sted:", value: "Gamle Åsvei 44" },
    { key: "Sted:", value: "TBD"},
    { key: "Kategori:", value: "Fadderuke"},
    { key: "Kategori:", value: "SMASH"},
    { key: "Kategori:", value: "FYLLA, WOHO!!!"},
    { key: "Kategori:", value: "Spilleopdrag (faktisk!) 🤯🤯"},
    { key: "Framkomstmiddel:", value: "Hurtigruta"},
    { key: "Framkomstmiddel:", value: "Buss"},
    { key: "Framkomstmiddel:", value: "Leiebil"},
    { key: "Påmeldingsfrist:", value: "I KVELD!!!"},
    { key: "Kleskode:", value: "Maskestrøm"},
    { key: "Kleskode:", value: "Studentergalla"},
    { key: "Antrekk:", value: "Full uniform"},
    { key: "Nødvendigheter:", value: "Pils, tran og uniform"},
    { key: "Oppmøte:", value: "Lageret på P15" },
    { key: "Oppmøte:", value: "Hovedbygget" },
    { key: "Pils?", value: "Pils!"},
    { key: "Minttu?", value: "Minttu!"},
    { key: "💩?", value: "💩!" },
    { key: "Fun fact:", value: "SMASH er relativt trygt ettersom det er relativt liten sannsynlighet for å møte på jerv" },
]

function AddInfoButton({onClick}: {onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return (
        <Button variant="contained" endIcon={<AddIcon/>} size="small" onClick={onClick} >Nøkkelinformasjon</Button>
    )
}