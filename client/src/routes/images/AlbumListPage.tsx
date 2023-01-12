import AddIcon from '@mui/icons-material/Add';
import { alpha, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ImageAlbum } from "common/interfaces";
import { useState } from 'react';
import { Link, LinkProps, useOutletContext } from "react-router-dom";
    
export default function AlbumListPage() {
    const data: ImageAlbum[] = useOutletContext<ImageAlbum[]>()
    return (
        <>
            <h2>Bilder</h2>
            <Albums items={data}/>
        </>
    )
}

function Albums({items}: {items: ImageAlbum[]}) {
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
                <AlbumItem key={album.id} album={album}/>
            ))}
        </div>
    )
}

function AlbumItem( {album}: {album: ImageAlbum}) {

    const linkProps: LinkProps = {
        to:`/bilder/${album.url}`, 
        style: {
            textDecoration: "none",
            color: "inherit"
        }
    }
 
    return (
        <div>
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