import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton, ImageList, ImageListItem, Modal, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { Image, ImageAlbum } from "common/interfaces";
import { useEffect, useState } from "react";
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

    const [openState, setOpenState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0})

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"))

    let listProps = {cols: 3, gap: 20}
    if( isSmallScreen ) listProps = { cols: 2, gap: 10 };
    if( isLargeScreen ) listProps = { cols: 4, gap: 30}

    return (
        <>
            <ImageList {...listProps} >
                {album.images.map( (image, index ) => (
                    <ImageListItem key={image.url}>
                        <img 
                            src={`/${image.url}`} 
                            loading="lazy"
                            onClick={() => setOpenState({isOpen: true, index: index})}
                            />
                    </ImageListItem>
                ))}
            </ImageList>
            <ImageLightBox 
                images={album.images}
                open={openState.isOpen} 
                openIndex={openState.index} 
                onClose={() => setOpenState({isOpen: false, index: 0})} />
        </>
    )
}

function ImageLightBox( {
    images, 
    onClose,
    open,
    openIndex, 
}: {
    images: Image[], 
    onClose: VoidFunction
    open: boolean
    openIndex: number, 
} ) {
    
    const [index, setIndex] = useState<number | undefined>(undefined)
    useEffect( () => open ? setIndex(openIndex) : setIndex(undefined), [ open ])

    const navigateNext = () => {
        const calcNext = (index: number) => (index + 1) % images.length 
        setIndex( currentIndex => calcNext(currentIndex ?? openIndex))
    }

    const navigateBack = () => {
        const calcPrev = (index: number) => (index - 1 + images.length) % images.length 
        setIndex( currentIndex => calcPrev(currentIndex ?? openIndex))
    }

    return (
        <Modal 
            open={open} 
            onClose={onClose}
            slotProps={{
                backdrop: { 
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)"
                    }
                }
            }}
        >
            <div>
                <img 
                    src={`/${images[index ?? openIndex].url}`} 
                    style={{
                        maxWidth: "99vw", 
                        maxHeight: "99vh",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: 'translate(-50%, -50%)',
                    }}/>
                <Tooltip title="Lukk bildevisning">
                    <IconButton 
                        size='large'
                        onClick={onClose}
                        aria-label="Lukk bildevisning"
                        style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px"
                        }}>
                        <CloseIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
                <NavigationButtons 
                    hide={images.length <= 1} 
                    onBackClick={navigateBack}
                    onForwardClick={navigateNext}
                />
            </div>
        </Modal>
    )
}

function NavigationButtons( {hide, onBackClick, onForwardClick}: {hide: boolean, onBackClick: VoidFunction, onForwardClick: VoidFunction}) {

    if(hide)
        return <></>

    return (
        <>
            <Tooltip title="Forrige">
                <IconButton 
                    size="large"
                    onClick={onBackClick}
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: 'translate(0, -50%)',
                        left: "5px",
                    }}>
                    <NavigateBeforeIcon fontSize='large'/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Neste">
                <IconButton 
                    size="large"
                    onClick={onForwardClick}
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: 'translate(0, -50%)',
                        right: "5px",
                    }}>
                    <NavigateNextIcon fontSize='large'/>
                </IconButton>
            </Tooltip>
        </>
    )
}