import AddIcon from '@mui/icons-material/Add';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, alpha, IconButton, MenuItem, Paper, Snackbar, Stack, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ImageAlbum, NewImageAlbum } from "common/interfaces";
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, LinkProps, useOutletContext } from "react-router-dom";
import { iconButtonStaticStyle } from 'src/assets/style/buttonStyle';
import { EditOrDeleteMenu } from 'src/components/menu/EditOrDeleteMenu';
import { postJson } from 'src/utils/postJson';

export default function AlbumListPage() {
    const data: ImageAlbum[] = useOutletContext<ImageAlbum[]>()
    return (
        <>
            <h2>Bilder</h2>
            <AlbumGrid items={data}/>
        </>
    )
}

function AlbumGrid({items}: {items: ImageAlbum[]}) {
    const isSmallScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.between(400, 800))
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between(800, 1000))
    const isLargeScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.up(1000))

    let colCount = 1
    if(isSmallScreen)  colCount = 2;
    if(isMediumScreen) colCount = 3;
    if(isLargeScreen)  colCount = 4;

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            rowGap: "20px",
            columnGap: "30px"
        }}>
            <AddNewAlbum/>
            {items.map( album => (
                <Album key={album.id} album={album}/>
            ))}
        </div>
    )
}

function Album({album}: {album: ImageAlbum}) {
    const [isEditing, setIsEditing] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    const onEditClick = () => setIsEditing(true)

    const onDeleteClick = () => {
        if(album.imageCount > 0) 
            return setErrorMsg("Kan bare slette tomme album")
        
        // TODO: Post delete message to server
    }

    const onSnackBarClose = () => setErrorMsg(undefined)

    if(isEditing)
        return (
            <EditForm 
                initialValue={album}  
                id={album.id}
                imgSrc={`/${album.coverImageUrl}`} 
                onAbortEdit={() => setIsEditing(false)}
            />
        )

    return (
        <>
            <AlbumReadOnly 
                album={album} 
                onEditClick={onEditClick} 
                onDeleteClick={onDeleteClick}/>
            <Snackbar 
                open={!!errorMsg} 
                autoHideDuration={6000}
                onClose={onSnackBarClose}
                anchorOrigin={isSmallScreen ? {vertical: "bottom", horizontal: "center"} : undefined}
            >
                <Alert severity='error' onClose={onSnackBarClose}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>
    )
}

function AlbumReadOnly( {album, onEditClick, onDeleteClick}: {album: ImageAlbum, onEditClick: VoidFunction, onDeleteClick: VoidFunction}) {

    const linkProps: LinkProps = {
        to:`/bilder/${album.url}`, 
        style: {
            textDecoration: "none",
            color: "inherit"
        }
    }
 
    return (
        <div style={{
                position: "relative"
            }}
        >
            <Link {...linkProps}>
                <Image 
                    src={`/${album.coverImageUrl}`} 
                    alt={album.title}
                />
            </Link>
            <EditOrDeleteMenu 
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick}
                style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                }}
                sx={iconButtonStaticStyle}
            />
            <Link {...linkProps} 
                style={{
                    ...linkProps.style,
                    fontSize: "large",
                    marginTop: "10px",
                    fontWeight: "bold",
                }}
            >
                {album.title}
            </Link>
            <br/>
            <Link {...linkProps} 
                style={{
                    ...linkProps.style,
                    opacity: "0.65",
                }}
            >
                {album.imageCount} bilder
            </Link>
        </div>
    )
}

function AddNewAlbum() {

    const [isForm, setIsForm] = useState(false)

    if(isForm) 
        return <EditForm initialValue={{isPublic: false, title: ""}} onAbortEdit={() => setIsForm(false)}/>

    return <AddNewButton onClick={() => setIsForm(true)}/>
}

interface ImageAlbumFormData extends Omit<NewImageAlbum, "isPublic"> {
    isPublic: "true" | "false"
} 

function EditForm( {
    initialValue, 
    id, 
    imgSrc, 
    onAbortEdit
}: {
    initialValue: NewImageAlbum, 
    id?: number, 
    imgSrc?: string,
    onAbortEdit: VoidFunction
}) {
    const { register, watch, handleSubmit } = useForm<ImageAlbumFormData>({ 
        defaultValues: {
            title: initialValue.title,
            isPublic: initialValue.isPublic ? "true" : "false"
        } 
    })

    const onSubmit: SubmitHandler<ImageAlbumFormData> = async album => {
        const formData: NewImageAlbum = { 
            title: album.title.trim(), 
            isPublic: album.isPublic === "true" 
        }

        const data = id !== undefined && id >= 0 
                   ? {...formData, id: id}
                   : formData

        const url  = id ? "/api/image-album/update" 
                        : "/api/image-album/new";

        const response = await postJson(url, data)
        console.log(response)
    }
    return (
        <Paper style={{
            borderTopLeftRadius: "10px", 
            borderTopRightRadius: "10px", 
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Image src={imgSrc}/>
                <div 
                    style={{
                        padding: "10px",
                        paddingBottom: "0px"
                    }}
                >
                    <TextField
                        label="Tittel"
                        fullWidth
                        autoComplete="off"
                        required
                        variant='standard'
                        sx={{mt: 1}}
                        {...register("title")}
                    />
                    <TextField 
                        select
                        label="Synlighet"
                        fullWidth
                        required
                        variant='standard'
                        sx={{mt: 5, mb: 3}}
                        {...register("isPublic")}
                        value={watch("isPublic")}
                        helperText={watch("isPublic") ? "Synlig for alle i offentligheten..." : "Synlig for innloggede brukere..."}
                        FormHelperTextProps={{ style: { opacity: 0.7 } }}
                    >
                        <MenuItem value={"false"}>Privat</MenuItem>
                        <MenuItem value={"true"}>Offentlig</MenuItem>
                    </TextField>
                    <SubmitButtons onAbortClick={onAbortEdit}/>
                </div>
            </form>
        </Paper>
    )
}

function SubmitButtons( {onAbortClick}: {onAbortClick: VoidFunction}) {
    return (
        <Stack direction="row" justifyContent="space-between" >
            <IconButton 
                color="error" 
                size="large" 
                edge="start" 
                onClick={onAbortClick} 
                >
                <BackspaceIcon/>
            </IconButton>
            <IconButton 
                type="submit"
                color="primary" 
                size="large" 
                edge="end"
            >
                <SaveIcon/>
            </IconButton>
        </Stack>
    )
}

function Image( {src, alt}: {src?: string, alt?: string}) {
    const theme = useTheme()
    const [isError, setIsError] = useState(false)

    const onError = () => setIsError(true)

    if(src === undefined || isError) {
        return (
            <div
                style={{
                    width: "100%",
                    aspectRatio: 1,
                    borderRadius: "10px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    opacity: 0.5,
                    marginBottom: "6px",
                    backgroundColor: theme.palette.action.hover,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <PhotoLibraryIcon style={{fontSize: "50px"}} />
            </div>
            
        )
    }

    return (
        <img
            src={src} 
            alt={alt}
            onError={onError}
            loading="lazy"
            style={{
                width: `100%`,
                aspectRatio: 1,
                objectFit: "cover",
                borderRadius: "10px"
            }}
        />
    )

}

function AddNewButton( {onClick}: {onClick: VoidFunction}) {
    const theme = useTheme()

    const [isMouseOver, setIsMouseOver] = useState(false)

    const onMouseEnter = () => setIsMouseOver(true)
    const onMouseLeave = () => setIsMouseOver(false)

    let boxStyle: React.CSSProperties = {}
    let textStyle: React.CSSProperties = {}
    if(isMouseOver) {
        boxStyle = {
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            opacity: 1,
            backgroundColor: alpha(theme.palette.secondary.main, 0.05),
            borderWidth: "1.5px",   
        }
        textStyle = {
            textDecoration: "underline"
        }
    } 

    return (
        <div>
            <div 
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    aspectRatio: 1,
                    borderRadius: "10px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    opacity: 0.5,
                    backgroundColor: theme.palette.action.hover,
                    cursor: "pointer",
                    
                    ...boxStyle,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <AddIcon style={{fontSize: `50px`}}/>
            </div>
            <span
                onClick={onClick} 
                style={{
                    cursor: "pointer",
                    fontSize: "large",
                    marginTop: "8px",
                    fontWeight: "bold",
                    display: "inline-block",

                    ...textStyle
                }}
            >
                Nytt album
            </span>
        </div>
    )
}