import { DevTool } from "@hookform/devtools";
import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, MenuItem, Stack, TextField } from "@mui/material";
import { NewImage, NewImageAlbum } from "common/interfaces";
import React, { useState } from "react";
import {
    Controller, SubmitHandler, useFieldArray, useForm
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FileDropZone from "src/components/FileDropZone";
import SubmitFormButtons from "src/components/form/SubmitButtons";
import { ImageLightBox } from 'src/components/ImageLightBox';

export default function NewPage() {
    return (
        <>
            <h1>Nytt album</h1>
            <NewAlbumForm/>
        </>
    )
}


interface NewImageAlbum2 extends Omit<NewImageAlbum, "images"> {
    images: NewImage2[]
} 

interface NewImage2 extends NewImage {
    file: File,
    url: string
}

const emptyAlbum: NewImageAlbum2 = {
    title: "",
    isPublic: false,
    images: []
}

function NewAlbumForm() {

    const { register, handleSubmit, control, getValues } = useForm<NewImageAlbum2>({ defaultValues: emptyAlbum })
    const { fields, append, remove } = useFieldArray( { name: "images", control: control } )

    const [openState, setOpenState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0})

    const navigate = useNavigate()
    const onAbortClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        navigate("/bilder")
    }

    const onSubmit: SubmitHandler<NewImageAlbum> = album => {
        // todo
        console.log(album)
    }

    const handleFileDrop = (files: File[]) => {
        const newImages: NewImage2[] = files.map( (file) => ({ 
            caption: "", 
            title: "", 
            file: file, 
            url: URL.createObjectURL(file),
            isPublic: getValues("isPublic") 
        }))
        append(newImages, { shouldFocus: fields.length > 0, focusIndex: fields.length })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid 
                    container 
                    columnSpacing={4}
                    rowGap={4}
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
                    {fields.map( (image, index) => (
                        <React.Fragment key={image.id}>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={{xs: 2, sm: 6}}>
                                    <TextField 
                                        label="Bildetekst"
                                        fullWidth
                                        {...register(`images.${index}.caption`, {  })}
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
                            <Grid item xs={12} sm={6} height="300px">
                                    <div style={{
                                        height: "100%",
                                        backgroundColor: "black",
                                        textAlign: "center",
                                        position: "relative",
                                    }}>
                                        <img 
                                            src={image.url} 
                                            onClick={() => setOpenState({isOpen: true, index: index})}
                                            onMouseEnter={() => document.body.style.cursor = "pointer"}
                                            onMouseLeave={() => document.body.style.cursor = "auto"}
                                            style={{
                                                maxWidth: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                marginBlock: "auto"
                                            }} />
                                        <IconButton 
                                            aria-label="Fjern bilde"
                                            onClick={ _ => remove(index)}
                                            style={{
                                                position: "absolute",
                                                top: "0px",
                                                right: "0px",
                                            }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                            </Grid>
                        </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                        <SubmitFormButtons 
                            onAbort={onAbortClick}
                        />
                    </Grid>
                </Grid>
            </form>

            {fields.length > 0  &&
                <ImageLightBox 
                    images={fields.map(image => image.url)}
                    open={openState.isOpen}
                    openIndex={openState.index}
                    onClose={() => setOpenState({isOpen: false, index: 0})} />
            }

            <DevTool control={control} /> {/* set up dev tool for react hook form */}
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