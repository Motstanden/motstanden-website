import { ImageList, ImageListItem, Modal, Theme, useMediaQuery } from "@mui/material";
import { Image, ImageAlbum } from "common/interfaces";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AlbumPage() {
    const album: ImageAlbum = useOutletContext<ImageAlbum>()

    return (
        <>
            <h1>{album.title}</h1>
            <AlbumViewer album={album}/>
        </>
    )
}

function AlbumViewer( { album }: { album: ImageAlbum }  ) {

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"))

    let listProps = {cols: 3, gap: 20}
    if( isSmallScreen ) listProps = { cols: 2, gap: 10 };
    if( isLargeScreen ) listProps = { cols: 4, gap: 30}

    return (
        <ImageList {...listProps} >
            {album.images.map( image => (
                <ImageViewer image={image} key={image.url} />
            ))}
        </ImageList>
    )
}



function ImageViewer( {image}: {image: Image}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <ImageListItem>
            <img 
                src={`/${image.url}`} 
                loading="lazy"
                onClick={handleOpen}
                />
            <Modal 
                open={open} 
                onClose={handleClose} 
                slotProps={{
                    backdrop: { 
                        style: {
                            backgroundColor: "rgba(0, 0, 0, 0.9)"
                        }
                    }
                }}  >
                <ImageModalPage image={image} />
            </Modal>
        </ImageListItem>
    )
}

function ImageModalPage( {image}: {image: Image}) {
    return (
        <img 
            src={`/${image.url}`} 
            style={{
                maxWidth: "100vw", 
                maxHeight: "100vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: 'translate(-50%, -50%)',
            }}/>
    )
}
