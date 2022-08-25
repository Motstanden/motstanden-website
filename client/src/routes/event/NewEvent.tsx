import { Button, Grid, IconButton, Stack, TextField, Tooltip } from "@mui/material"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import { Box } from "@mui/system"
import { DateTimePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubmitFormButtons from "src/components/SubmitFormButtons"
import { TitleCard } from "src/components/TitleCard"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { RichTextEditor } from "./RichTextEditor"

export function NewEventPage(){
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const [eventData, setEventData] = useState<EventData>({title: "", startDateTime: "", endDateTime: ""})
    const [extraInfo, setExtraInfo] = useState<KeyValuePair[]>([])

    const today = dayjs()
    const startDate = dateTimeStrToDayjs(eventData.startDateTime)
    const endDate = dateTimeStrToDayjs(eventData.endDateTime)
    const isValidStartDate = !!startDate && startDate.isAfter(today)
    const isValidEndDate = !!endDate && endDate.isAfter(startDate) 
    const isValidData = !!eventData.title && isValidStartDate && isValidEndDate 

    const onSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setIsSubmitting(true)
    }
    return (
        <>
            <h1>Nytt arrangement</h1>
            <form onSubmit={onSubmit}>
                {/* <TitleCard title="Nøkkelinfo"> */}
                <Paper elevation={6} sx={{p: 2, mt: 4}}>
                    <h3>Nøkkelinfo</h3>
                    <Stack spacing={4}>
                        <TextField
                            label="Tittel"
                            name="title"
                            value={eventData.title}
                            onChange={e => setEventData({...eventData, title: e.target.value})}
                            required
                            sx={{mt: 2}}
                            />
                        <div>
                            <DateTimePicker
                                label="Starter"
                                minDateTime={today}
                                value={startDate}
                                onChange={(newVal: Dayjs | null) => setEventData({...eventData, startDateTime: dayjsToDateTimeStr(newVal)})}
                                renderInput={ params => <TextField {...params} required fullWidth/>}
                                />
                            {startDate && !isValidStartDate && <Box color="error.main"><>Start-tidspunkt kan ikke være tidligere enn kl {today.format("HH:mm:ss, DD MM YYYY")}</></Box>}
                        </div>
                        <div>
                            <DateTimePicker
                                label="Slutter"
                                disabled={!eventData.startDateTime}
                                minDateTime={startDate ?? today}
                                value={endDate}
                                onChange={(newVal: Dayjs | null) => setEventData({...eventData, endDateTime: dayjsToDateTimeStr(newVal)})}
                                renderInput={ params => <TextField {...params} required fullWidth/>}
                                />
                            {endDate && !isValidEndDate && <Box color="error.main">Slutt-tidspunkt kan ikke komme før start-tidspunkt</Box>}
                        </div>
                    <MoreInfoForm value={extraInfo} onChange={ (newValue) => setExtraInfo(newValue)}/>
                    </Stack>
                    <Divider sx={{my: 4}}/>
                    <h3>Beskrivelse</h3>
                    <div>
                        <RichTextEditor/>
                    </div>
                </Paper>
                <Box sx={{mt: 4}}>
                    <SubmitFormButtons 
                        onAbort={ e => navigate("/arrangement")} 
                        loading={isSubmitting}
                        disabled={!isValidData}/>
                </Box>
            </form>
        </>
    )
}

function MoreInfoForm( { value, onChange}: {value: KeyValuePair[], onChange: (newValues: KeyValuePair[]) => void} ) {

    const onAddClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newItems = [...value, {key: "", value: ""}]
        onChange(newItems)
    }

    const onItemChange = (index: number, newVal: KeyValuePair) => {
        let newItems = [...value]
        newItems[index] = newVal
        onChange(newItems)
    }

    const onDeleteClick = (index: number) => {
        let newItems = [...value]
        newItems.splice(index, 1)
        onChange(newItems)
    }

    return (
        <Stack>
            {value.map( (item, index) => (
                <div key={`${index}`}>
                    <Divider />
                    <Grid container 
                        py={4} 
                        justifyContent="space-between"
                        alignItems="center"
                        rowSpacing={4}
                        >
                        <Grid item xs={11} sm={5.5}>
                            <TextField 
                                    label="Tittel"
                                    value={item.key}
                                    fullWidth
                                    required
                                    onChange={ e => onItemChange(index, {key: e.target.value, value: item.value})}
                                    />  
                        </Grid> 
                        <Grid item xs={1} display={{xs: "inline", sm: "none"}}>
                            <DeleteButton onClick={e => onDeleteClick(index)}/>
                        </Grid>
                        <Grid item xs={12} sm={5.5} pl={{sm: 2}}>
                            <TextField
                                    label={item.key ?? "Info"}
                                    fullWidth
                                    value={item.value}
                                    required
                                    onChange={ e => onItemChange(index, {key: item.key, value: e.target.value})}
                                    />
                        </Grid>
                        <Grid item xs={1} display={{xs: "none", sm: "inline"}}>
                            <DeleteButton onClick={e => onDeleteClick(index)}/>
                        </Grid>
                    </Grid>
                </div>
            ))}
            <div>
                <Tooltip title="Legg til mer info">
                    <IconButton color="primary" onClick={onAddClick}>
                        <PlaylistAddIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </Stack>
    )
}

function DeleteButton( {onClick}: {onClick?: React.MouseEventHandler<HTMLButtonElement>} ){
    return (
        <Tooltip title="Slett">
            <IconButton onClick={onClick}>
                <DeleteForeverIcon/>
            </IconButton>
        </Tooltip>
    )
}


function dateTimeStrToDayjs(str: string) {
    return str ? dayjs(str, "YYYY-MM-DD HH-mm-ss") : null 
}

function dayjsToDateTimeStr(dayjs: Dayjs | null) {
    return dayjs?.format("YYYY-MM-DD HH-mm-00") ?? ""
}

interface KeyValuePair {
    key: string,
    value: string
}

interface EventData {
    title: string 
    startDateTime: string
    endDateTime: string
    extraInfo?: KeyValuePair[]
}