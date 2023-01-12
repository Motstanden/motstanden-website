import AddIcon from '@mui/icons-material/Add';
import { Alert, alpha, Snackbar, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ImageAlbum } from "common/interfaces";
import { useState } from 'react';
import { Link, LinkProps, useOutletContext } from "react-router-dom";
import { iconButtonStaticStyle } from 'src/assets/style/buttonStyle';
import { EditOrDeleteMenu } from 'src/components/menu/EditOrDeleteMenu';
    
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
            <EditForm/>
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
                <img
                    src={`/${album.coverImageUrl}`} 
                    alt={album.title}
                    loading="lazy"
                    style={{
                        width: `100%`,
                        aspectRatio: 1,
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                />
            </Link>
            <EditOrDeleteMenu 
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick}
                iconOrientation="vertical"
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
        return <EditForm/>

    return <AddNewButton onClick={() => setIsForm(true)}/>
}

function EditForm() {
    return (
        <>
            Redigerer
        </>
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