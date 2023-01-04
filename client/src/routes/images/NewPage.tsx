import { Grid, MenuItem, Stack, TextField } from "@mui/material"
import { NewImage, NewImageAlbum } from "common/interfaces"
import React, { useState } from "react"
import FileDropZone from "src/components/FileDropZone"
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

    const handleFileDrop = (files: File[]) => {
        const newImages: NewImage[] = files.map( file => ({ 
            caption: "", 
            isPublic: 
            album.isPublic, 
            file: file
        }))
        setAlbum(prev => ({
            ...prev, 
            images: prev.images.concat(newImages)
        }))
    }

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
                <Grid item xs={12} my={4}>
                    <FileDropZone accept="image/*" onChange={handleFileDrop} />                    
                </Grid>
                {album.images.map( image => {
                    const url = URL.createObjectURL(image.file)
                    return (
                        <React.Fragment key={url}>
                            <Grid item xs={12} sm={6}>
                                <Stack 
                                    spacing={{xs: 2, sm: 6}} 
                                    >
                                    <TextField 
                                        label="Bildetekst"
                                        name="caption"
                                        fullWidth
                                    />
                                    <SelectIsPublic value={image.isPublic} onChange={(newValue) => {}}/>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <img 
                                    src={url} 
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover"
                                    }} />
                            </Grid>
                        </React.Fragment>
                    )
                })}
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