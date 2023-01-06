import { DevTool } from "@hookform/devtools";
import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, MenuItem, Stack, TextField } from "@mui/material";
import { NewImage, NewImageAlbum } from "common/interfaces";
import React, { useState } from "react";
import { Control, SubmitHandler, useController, UseControllerProps, useFieldArray, useForm } from "react-hook-form";
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

    const navigate = useNavigate()
    const onAbortClick = () => {
        navigate("/bilder")
    }
    
    const [openState, setOpenState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0})
    const onImageClick = (index: number) => {
        setOpenState({isOpen: true, index: index})
    }

    const onRemoveImageClick = (index: number) => {
        remove(index)
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
                        <SelectIsPublic 
                            control={control} 
                            name="isPublic" 
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
                                    <SelectIsPublic 
                                        control={control} 
                                        name={`images.${index}.isPublic`} 
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6} height="300px">
                                <Img
                                    onRemoveClick={_ => onRemoveImageClick(index)} 
                                    src={image.url} 
                                    onClick={ _ => onImageClick(index)}
                                /> 
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

// Same as UseControllerProps, but make control mandatory
interface SelectIsPublicProps extends UseControllerProps<NewImageAlbum2> {
    control: Control<NewImageAlbum2>
}

function SelectIsPublic(props:  SelectIsPublicProps){
    const { field } = useController(props)
    return (
        <TextField 
            select
            label="Synlighet"
            fullWidth
            name={field.name}
            value={field.value ? "true" : "false"}
            onBlur={field.onBlur}
            onChange={ (e) => field.onChange(e.target.value === "true") }
            helperText={field.value ? "Synlig for alle i offentligheten..." : "Synlig for innloggede brukere..."}
            FormHelperTextProps={{ style: { opacity: 0.7 } }}
        >
            <MenuItem value={"false"}>Privat</MenuItem>
            <MenuItem value={"true"}>Offentlig</MenuItem>
        </TextField>
    )
}

function Img({
    src, 
    onClick,
    onRemoveClick
}: {
    src: string, 
    onRemoveClick?: React.MouseEventHandler<HTMLButtonElement>,
    onClick?: React.MouseEventHandler<HTMLImageElement>,
}) {

    const onMouseEnter = () => {
        document.body.style.cursor = "pointer"
    }

    const onMouseLeave = () => {
        document.body.style.cursor = "auto"
    }

    return (
        <div style={{
            height: "100%",
            backgroundColor: "black",
            textAlign: "center",
            position: "relative",
        }}>
            <img 
                src={src} 
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    maxWidth: "100%",
                    height: "100%",
                    objectFit: "cover",
                    marginBlock: "auto"
                }} />
            <IconButton
                aria-label="Fjern bilde"
                onClick={onRemoveClick}
                style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                }}>
                <CloseIcon />
            </IconButton>
        </div>
    )
}