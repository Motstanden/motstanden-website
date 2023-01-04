import { Grid, MenuItem, TextField } from "@mui/material"
import { NewImageAlbum } from "common/interfaces"
import { useState } from "react"
import { Form } from "src/components/form/Form"

export default function NewPage() {
    return (
        <>
            <h1>Nytt album</h1>
            <NewAlbumForm/>
        </>
    )
}

const emptyAlbum: NewImageAlbum = {
    isPublic: false,
    title: "",
    images: []
}

function NewAlbumForm() {
    const [album, setAlbum] = useState<NewImageAlbum>(emptyAlbum)
    return (
        <Form value={album} postUrl="todo">
            <Grid 
                container 
                columnSpacing={4} 
                rowSpacing={4}
            >
                <Grid item xs={12} md={8}>
                    <TextField
                        label="Tittel"
                        name="title"
                        required
                        fullWidth
                        autoComplete="off"
                        value={album.title}
                        onChange={(e) => setAlbum( prev => ({...prev, title: e.target.value}))}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SelectIsPublic 
                        value={album.isPublic} 
                        onChange={newVal => setAlbum(prev => ({...prev, isPublic: newVal}))} 
                    />
                </Grid>
            </Grid>
        </Form>
    )
}

function SelectIsPublic({value, onChange}: {value: boolean, onChange: (newValue: boolean) => void}) {
    return (
        <TextField 
            select
            label="Synlighet"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value === "true")}
            helperText={value ? "Synlig for alle i offentligheten..." : "Synlig for innloggede brukere..."}
            FormHelperTextProps={{ style: { opacity: 0.7 } }}
        >
            <MenuItem value={"false"} >Privat</MenuItem>
            <MenuItem value={"true"} >Offentlig</MenuItem>
        </TextField>
    )
}