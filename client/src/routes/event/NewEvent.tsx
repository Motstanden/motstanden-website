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
import { Button, Divider, IconButton, SxProps, TextField } from "@mui/material"
import Stack from "@mui/system/Stack"
import { useNavigate } from "react-router-dom"
import { Toolbar } from "./RichTextEditor"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Form } from "src/components/form/Form"

export function NewEventPage() {

    return (
        <>
            <h1>Nytt arrangement</h1> 
            <EventForm backUrl="/arrangement" postUrl=""/>
        </>
    )   
}

export function EventForm( {backUrl, postUrl}: {backUrl: string, postUrl: string} ) {
    const navigate = useNavigate()

    return (
        <Form 
            value={{}}
            postUrl={postUrl}
            onAbortClick={ e => navigate(backUrl)}
        >
            <Paper elevation={6} sx={{px: 2, pb: 4, pt: 1}}>
                <EventEditor/>
            </Paper> 
        </Form>
    )
}


const initialValue: Descendant[] = [
    {
        type: ElementType.Paragraph,
        children: [{text: ""}]
    }
]


function EventEditor(){
    // const editor = useMemo(() => withHistory(withHistory(withReact(createEditor()))), [])        // Production
    const [editor] = useState(withHistory(withReact(createEditor())))            // Development
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

function TitleForm( { sx }: {sx?: SxProps } ) {
    const [title, setTitle] = useState("")
    return (
        <TextField
            variant="standard"
            placeholder="Tittel på arrangement*"
            autoComplete="off"
            required
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            InputProps={{ style: {fontSize: "1.5em", fontWeight: "bolder"}}}
            sx={sx}
        />
    )
}

function TimeForm({ sx }: {sx?: SxProps } ) {
    const today = dayjs()
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)
    return (
        <Stack direction="row" alignItems="flex-end" sx={sx}>
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

function ExtraInfoForm() {

    const [items, setItems] = useState<ExtraInfo[]>([])

    const onAddClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setItems( prev => [...prev, {key: "", value: ""}])
    }

    const onDeleteClick = (i: number) => {
        let newItems = [...items]
        newItems.splice(i, 1)
        setItems(newItems)
    }


    if(items.length === 0) {
        return ( 
            <div>
                <AddInfoButton onClick={onAddClick}/>
            </div>
        )
    }

    return (
        <Stack>
            {items.map( (item, index) => <ExtraInfoItem key={index} value={item} onDeleteClick={() => onDeleteClick(index)} />)}
            <div>
                <AddInfoButton onClick={onAddClick}/>
            </div>
        </Stack>
    )
}

function ExtraInfoItem( {value, onDeleteClick }: {value: ExtraInfo, onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return (
        <div>
            <TextField 
                required 
                sx={{mb: 4}}
                style={{maxWidth: "100px", marginRight: "10px"}}
                InputProps={{ style: {fontWeight: "bold"}}}
                variant="standard"
                placeholder="Tittel*"
            />
            <TextField required variant="standard" placeholder="info*" /> 
            <IconButton style={{marginLeft: "20px"}} onClick={onDeleteClick}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}
interface ExtraInfo{ 
    key: string,
    value: string,
}

function AddInfoButton({onClick}: {onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
    return (
        <Button variant="outlined" endIcon={<AddIcon/>} size="small" onClick={onClick} >Info</Button>
    )
}