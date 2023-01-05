import { DevTool } from "@hookform/devtools";
import { Grid, MenuItem, Stack, TextField } from "@mui/material";
import { NewImageAlbum } from "common/interfaces";
import React, { useState } from "react";
import {
    Controller, SubmitHandler, useForm
} from "react-hook-form";
import FileDropZone from "src/components/FileDropZone";
import { ImageLightBox } from 'src/components/ImageLightBox';

export default function NewPage() {
    return (
        <>
            <h1>Nytt album</h1>
            <NewAlbumForm/>
        </>
    )
}
function NewAlbumForm() {

    const formMethods = useForm<NewImageAlbum>({
        defaultValues: {
            title: "",
            isPublic: false,
            images: []
    }})
    const { register, handleSubmit, control, getValues } = formMethods

    const [files, setFiles] = useState<File[]>([])
    const [openState, setOpenState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0})

    const onSubmit: SubmitHandler<NewImageAlbum> = album => {
        // todo
    }

    const handleFileDrop = (files: File[]) => {
        setFiles(prev => prev.concat(files))
    }

    const fileUrls: string[] = files.map( file => URL.createObjectURL(file))

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid 
                    container 
                    columnSpacing={4} 
                    rowSpacing={4}
                >
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Tittel"
                            fullWidth
                            autoComplete="off"
                            required
                            {...register("title")}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Controller 
                            control={control} 
                            name="isPublic" 
                            render={ ({ field }) => <SelectIsPublic value={field.value} onChange={field.onChange} name={field.name} />}
                        />
                    </Grid>
                    <Grid item xs={12} my={4    }>
                        <FileDropZone accept="image/*" onChange={handleFileDrop} /> 
                    </Grid>
                    {fileUrls.map( (url, index) => (
                        <React.Fragment key={url}>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={{xs: 2, sm: 6}}>
                                    <TextField 
                                        label="Bildetekst"
                                        fullWidth
                                        {...register(`images.${index}.caption`)}
                                    />
                                    <Controller 
                                        control={control} 
                                        name={`images.${index}.isPublic`} 
                                        render={ ({ field }) => 
                                            <SelectIsPublic 
                                                value={field.value} 
                                                onChange={field.onChange} 
                                                name={field.name} 
                                            />}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6} height="330px">
                                <img 
                                    src={url} 
                                    onClick={() => setOpenState({isOpen: true, index: index})}
                                    onMouseEnter={() => document.body.style.cursor = "pointer"}
                                    onMouseLeave={() => document.body.style.cursor = "auto"}
                                    style={{
                                        width: "100%",
                                            maxHeight: "300px",
                                        objectFit: "cover"
                                    }} />
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </form>

            {fileUrls.length > 0  &&
                <ImageLightBox 
                    images={fileUrls}
                    open={openState.isOpen}
                    openIndex={openState.index}
                    onClose={() => setOpenState({isOpen: false, index: 0})} />
            }
            <DevTool control={control} /> {/* set up the dev tool */}
        </>
    )
}

function SelectIsPublic({
    onChange, 
    value, 
    name, 
}: {
    onChange: (value: boolean) => void, 
    value: boolean,
    name: string,
}){
    return (
        <TextField 
            select
            name={name}
            label="Synlighet"
            fullWidth
            value={value ? "true" : "false"}
            onChange={ (e) => onChange(e.target.value === "true") }
            helperText={value ? "Synlig for alle i offentligheten..." : "Synlig for innloggede brukere..."}
            FormHelperTextProps={{ style: { opacity: 0.7 } }}
        >
            <MenuItem value={"false"}>Privat</MenuItem>
            <MenuItem value={"true"}>Offentlig</MenuItem>
        </TextField>
    )
}