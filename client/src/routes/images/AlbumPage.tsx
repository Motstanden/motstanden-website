import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, IconButton, ImageList, ImageListItem, Link, Modal, Theme, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Image, ImageAlbum } from "common/interfaces";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';

export default function AlbumPage() {
    const album: ImageAlbum = useOutletContext<ImageAlbum>()

    return (
        <>
            <Crumbs  title={album.title}/>
            <CreationInfo created={album.createdAt} updated={album.updatedAt}/>
            <AlbumViewer album={album}/>
        </>
    )
}

function Crumbs( { title }: { title: string}) {
    return (
        <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" opacity={0.7} />} 
            style={{marginBottom: "5px", marginTop: "20px"}}
            >
            <Link 
                underline='hover' 
                color="inherit" 
                component={RouterLink} 
                to={"/bilder"}
                style={{opacity: 0.7}}
                variant="h5"
            >
                Bilder
            </Link>
            <Typography variant='h5'>
                {title}
            </Typography>
        </Breadcrumbs>
    )
}

function CreationInfo( { created, updated}: {created: string, updated: string}) {

    const prettyCreated = dayjs(created).utc(true).local().format("DD. MMM YYYY HH:mm")
    const prettyUpdated = dayjs(updated).utc(true).local().format("DD. MMM YYYY HH:mm")

    return (
        <div style={{
                fontSize: "small",
                opacity: 0.75,
                paddingBlock: "10px",
                display: "grid",
                gridTemplateColumns: "min-content auto",
                columnGap: "5px",
                rowGap: "4px"
            }}
        >
            <div>Opprettet:</div>
            <div>{prettyCreated}</div>
            {prettyCreated !== prettyUpdated && (
                <>
                    <div>Redigert:</div>
                    <div>{prettyUpdated}</div>
                </>
            )}
        </div>
    )
}

function AlbumViewer( { album }: { album: ImageAlbum }  ) {

    const [openState, setOpenState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0})

    const isSmallScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.between(410, "md"))
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.only("md"))
    const isLargeScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.up("lg"))

    let listProps = {cols: 1, gap: 10}
    if(isSmallScreen) listProps  = {cols: 2, gap: 10};
    if(isMediumScreen) listProps = {cols: 3, gap: 20};
    if(isLargeScreen) listProps  = {cols: 4, gap: 30};

    const onMouseEnterImage = (_: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        document.body.style.cursor = "pointer"   
    }

    const onMouseLeaveImage = (_: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        document.body.style.cursor = "auto"   
    }

    return (
        <>
            <ImageList {...listProps} rowHeight={250} variant="standard">
                {album.images.map( (image, index ) => (
                    <ImageListItem key={image.url}>
                        <img 
                            onMouseEnter={onMouseEnterImage}
                            onMouseLeave={onMouseLeaveImage}
                            src={`/${image.url}`} 
                            loading="lazy"
                            onClick={() => setOpenState({isOpen: true, index: index})}
                            style={{
                                maxHeight: "250px",
                                borderRadius: "10px"
                            }}
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

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = e;
        if(key === "ArrowRight") {
            e.preventDefault()
            navigateNext()
        } else if(key === "ArrowLeft") {
            e.preventDefault()
            navigateBack()
        }
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: navigateNext,
        onSwipedRight: navigateBack,
        onSwipedUp: onClose,
        onSwipedDown: onClose,
        preventScrollOnSwipe: true
    })

    return (
        <Modal 
            open={open} 
            onKeyDown={onKeyDown}
            onClose={onClose}
            {...swipeHandlers}
            closeAfterTransition={true}
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
                <span style={{
                    position: "absolute",
                    top:"17px",
                    left: "15px",
                    fontSize: "x-large",
                    opacity: 0.5
                }}>
                    {(index ?? openIndex) + 1}/{images.length}
                </span>
            </div>
        </Modal>
    )
}

function NavigationButtons( {hide, onBackClick, onForwardClick}: {hide: boolean, onBackClick: VoidFunction, onForwardClick: VoidFunction}) {

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    if(hide || isSmallScreen)
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