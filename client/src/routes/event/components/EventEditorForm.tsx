import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    SxProps,
    TextField,
    TextFieldProps,
    Theme,
    useMediaQuery
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { KeyValuePair, UpsertEventData } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dateTimePickerStyle } from 'src/assets/style/timePickerStyles';
import { Form } from "src/components/form/Form";
import { useTitle } from "src/hooks/useTitle";
import { MarkDownEditor } from '../../../components/MarkDownEditor';

export interface EventEditorState {
    title: string
    startTime: Dayjs | null,
    endTime: Dayjs | null,
    keyInfo: KeyValuePair<string, string>[]
    description: string
}

function createValidState(initialValue: EventEditorState): EventEditorState {
    const newValue = { ...initialValue };
    newValue.startTime = initialValue.startTime?.utc(true).local() ?? null
    newValue.endTime = initialValue.endTime?.utc(true).local() ?? null
    return newValue;
}

export function EventEditorForm({ 
    backUrl, 
    postUrl, 
    initialValue, 
    eventId 
}: { 
    backUrl: string; 
    postUrl: string; 
    initialValue: EventEditorState; 
    eventId?: number; 
}) {
    const [event, setEvent] = useState(createValidState(initialValue));

    const navigate = useNavigate()

    useTitle(`${isNullOrWhitespace(event.title) ? "Ingen tittel" : event.title}*`)

    const onValueChanged = (newValues: Partial<EventEditorState>) => {
        setEvent(oldValues => ({ ...oldValues, ...newValues }))
    }

    const serializeState = (): UpsertEventData => {
        const serializedEvent: UpsertEventData = {
            eventId: eventId,
            title: event.title,
            startDateTime: event.startTime!.utc(false).format("YYYY-MM-DD HH:mm:00"),
            endDateTime: event.endTime?.utc(false).format("YYYY-MM-DD HH:mm:00") ?? null,
            keyInfo: event.keyInfo,
            description: event.description.trim(),
        };
        return serializedEvent;
    };

    const onPostSuccess = async (res: Response) => {
        const data = await res.json();
        window.location.href = `${window.location.origin}/arrangement/${eventId ?? data.eventId ?? ""}`;   // Will trigger a page reload
    };

    const editorHasContent = (): boolean => !isNullOrWhitespace(event.description)

    const validateState = () => {
        const isValidTitle = !isNullOrWhitespace(event.title)
        const isValidStartTime = event.startTime && event.startTime.isValid()
        const isValidEndTime = event.endTime ? event.endTime.isValid() : true
        const isValidKeyInfo = !event.keyInfo.find(item => item.key.length === 0 || item.value.length === 0)

        return isValidTitle && isValidStartTime && isValidEndTime && isValidKeyInfo && editorHasContent()
    }

    const isStateValid = validateState()

    return (
        <Form
            value={() => serializeState()}
            postUrl={postUrl}
            onAbortClick={_ => navigate(backUrl)}
            onPostSuccess={onPostSuccess}
            disabled={!isStateValid}
        >
            <Paper elevation={6} sx={{ px: 2, pb: 4, pt: 3 }}>
                <EventEditor value={event} onChange={onValueChanged} />
            </Paper>
        </Form>
    );
}

interface EventFormProps {
    value: EventEditorState, 
    onChange: (newValues: Partial<EventEditorState>) => void
    sx?: SxProps
}


function EventEditor( props: Omit<EventFormProps, "sx"> ) {
    const {value, onChange} = props
    return (
        <section>
            <EventInfoForm value={value} onChange={onChange} />
            <MarkDownEditor
                placeholder="Beskrivelse av arrangement *"
                required
                value={value.description}
                onChange={newValue => onChange({ description: newValue })}
                minRows={6}
            />
        </section>
    )
}

function EventInfoForm( props: Omit<EventFormProps, "sx">) {
    return (
        <Stack sx={{ mb: 6 }}>
            <TitleForm {...props} sx={{ mb: 4 }} />
            <TimeForm {...props}  sx={{ mb: { xs: 4, sm: 2 } }} />
            <KeyInfoForm {...props} />
        </Stack>
    )
}

function TitleForm(props: EventFormProps) {
    const {value, onChange, sx} = props
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <TextField
            variant="standard"
            placeholder="Tittel på arrangement *"
            autoComplete="off"
            color="secondary"
            required
            fullWidth
            value={value.title}
            onChange={e => onChange({ title: e.target.value })}
            InputProps={{ style: { fontSize: isSmallScreen ? "1.25em" : "1.5em", fontWeight: "bolder" } }}
            sx={sx}
        />
    )
}

const beginningOfTime = dayjs("2018-09-11")  // Motstandens birth day

function TimeForm(props: EventFormProps) {
    const {value, onChange, sx} = props
    const textFieldProps: TextFieldProps = {
        autoComplete: "off",
        variant: "standard",
        fullWidth: true,
        sx: {
            maxWidth: { xs: "100%", sm: "180px" }
        }
    }
    return (
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "top", sm: "flex-end" }} sx={sx}>
            <Box sx={{
                minWidth: "145px",
                marginBottom: "5px"
            }}>
                <strong >
                    Tidspunkt:
                </strong>
            </Box>
            <DateTimePicker
                label="Starter"
                {...dateTimePickerStyle}
                minDateTime={beginningOfTime}
                defaultCalendarMonth={dayjs()}
                value={value.startTime}
                onChange={(newVal: Dayjs | null) => onChange({ startTime: newVal })}
                renderInput={params => (
                    <TextField {...params} {...textFieldProps} required color="secondary" />
                )}
            />
            <Box display={{ xs: "none", sm: "inline" }} style={{ marginInline: "20px", marginBottom: "5px" }}>
                –
            </Box>
            <DateTimePicker
                label="Slutter"
                {...dateTimePickerStyle}
                disabled={!value.startTime}
                minDateTime={value.startTime ?? beginningOfTime}
                value={value.endTime}
                onChange={(newVal: Dayjs | null) => onChange({ endTime: newVal })}
                renderInput={params => (
                    <TextField {...params} {...textFieldProps} color="secondary" />
                )}
            />
        </Stack>
    )
}

function KeyInfoForm(props: EventFormProps) {
    const {value, onChange, sx} = props

    const onAddClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newItems = [...value.keyInfo, { key: "", value: "" }]
        onChange({ keyInfo: newItems })
    }

    const onDeleteClick = (i: number) => {
        const newItems = [...value.keyInfo]
        newItems.splice(i, 1)
        onChange({ keyInfo: newItems })
    }

    const onValueChange = (i: number, newVal: KeyValuePair<string, string>) => {
        const newItems = [...value.keyInfo]
        newItems[i] = newVal
        onChange({ keyInfo: newItems })
    }

    if (value.keyInfo.length === 0) {
        return (
            <div style={{ marginTop: "30px" }}>
                <AddInfoButton onClick={onAddClick} />
            </div>
        )
    }

    return (
        <Stack>
            {value.keyInfo.map((item, index) => <KeyInfoItem
                key={index}
                value={item}
                onChange={newVal => onValueChange(index, newVal)}
                onDeleteClick={() => onDeleteClick(index)} />
            )}
            <div>
                <AddInfoButton onClick={onAddClick} />
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
    onDeleteClick?: React.MouseEventHandler<HTMLButtonElement>
}
) {
    const randomExample = useMemo(() => keyValueExample[Math.floor(Math.random() * keyValueExample.length)], [])
    const maxKeyChars = 16
    const maxValueChars = 100
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        if (value.key.length > maxKeyChars || value.value.length > maxValueChars) {
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
                gridTemplateColumns: isSmallScreen ? "auto min-content" : "min-content auto min-content max-content",
                columnGap: "15px",
                marginBottom: "30px",
                width: "100%"
            }}
        >
            <TextField
                {...sharedProps}
                value={value.key}
                style={{ minWidth: "130px" }}
                variant="standard"
                placeholder="Tittel *"
                onChange={e => onChange({ ...value, key: e.target.value })}
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
                placeholder="info *"
                style={{ width: "100%" }}
                onChange={e => onChange({ ...value, value: e.target.value })}
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
                    gridRow: isSmallScreen ? "1 / 3" : "1"

                }}
                aria-label="Fjern nøkkelinformasjon"
                onClick={onDeleteClick}>
                <DeleteIcon color="error" />
            </IconButton>
        </div>
    )
}

const keyValueExample: KeyValuePair<string, string>[] = [
    { key: "Sted:", value: "Bergstua" },
    { key: "Sted:", value: "Gamle Åsvei 44" },
    { key: "Sted:", value: "TBD" },
    { key: "Kategori:", value: "Fadderuke" },
    { key: "Kategori:", value: "SMASH" },
    { key: "Kategori:", value: "FYLLA, WOHO!!!" },
    { key: "Kategori:", value: "Spilleopdrag (faktisk!) 🤯🤯" },
    { key: "Framkomstmiddel:", value: "Hurtigruta" },
    { key: "Framkomstmiddel:", value: "Buss" },
    { key: "Framkomstmiddel:", value: "Leiebil" },
    { key: "Påmeldingsfrist:", value: "I KVELD!!!" },
    { key: "Kleskode:", value: "Maskestrøm" },
    { key: "Kleskode:", value: "Studentergalla" },
    { key: "Antrekk:", value: "Full uniform" },
    { key: "Nødvendigheter:", value: "Pils, tran og uniform" },
    { key: "Oppmøte:", value: "Lageret på P15" },
    { key: "Oppmøte:", value: "Hovedbygget" },
    { key: "Pils?", value: "Pils!" },
    { key: "Minttu?", value: "Minttu!" },
    { key: "💩?", value: "💩!" },
    { key: "Fun fact:", value: "SMASH er relativt trygt ettersom det er relativt liten sannsynlighet for å møte på jerv" },
]

function AddInfoButton({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
    return (
        <Button 
            variant="contained" 
            endIcon={<AddIcon />} 
            size="small" 
            onClick={onClick} 
            color="secondary"
        >
                Nøkkelinfo
        </Button>
    )
}