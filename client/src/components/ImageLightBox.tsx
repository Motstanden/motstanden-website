import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton, Modal, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { strToNumber } from 'common/utils';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';


export function useIndexParam(): [
    number | undefined, 
    (newValue: number | undefined) => void
] {

    const [searchParams, setSearchParams] = useSearchParams()
    const index = strToNumber(searchParams.get("bildenummer") ?? undefined)

    const setIndex = (newValue: number | undefined) => {
        if(newValue === undefined) {
            searchParams.delete("bildenummer")
        } else {
            searchParams.set("bildenummer", `${newValue}`)
        }

        setSearchParams(searchParams, {replace: index !== undefined})
    }

    return [index, setIndex]
}

export function ImageLightBox( { images }: { images: string[]} ) {
    const [index, setIndex] = useIndexParam()

    useEffect( () => {
        if(images.length <= 0){
            setIndex(undefined)
        }
    }, [images.length])


    if(index === undefined)
        return <></>

    const onClose = () => setIndex(undefined)

    const actualIndex = (index + images.length - 1) % images.length

    const navigateNext = () => {
        const nextIndex =  (actualIndex + 1 % images.length) + 1
        setIndex(nextIndex)
    }

    const navigateBack = () => {
        const prevIndex = ((actualIndex + images.length - 1 ) % images.length) + 1 
        setIndex(prevIndex)
    }

    return (
        <ImageViewer 
            images={images}
            index={actualIndex}
            onClose={onClose}
            onNavigateNext={navigateNext}
            onNavigateBack={navigateBack}
        />
    )

}

function ImageViewer( { 
    images, 
    index, 
    onClose, 
    onNavigateNext, 
    onNavigateBack 
}: { 
    images: string[]
    index: number,
    onClose: VoidFunction
    onNavigateNext: VoidFunction,
    onNavigateBack: VoidFunction
} ) {

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = e;
        if(key === "ArrowRight") {
            e.preventDefault()
            onNavigateNext()
        } else if(key === "ArrowLeft") {
            e.preventDefault()
            onNavigateBack()
        }
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: onNavigateNext,
        onSwipedRight: onNavigateBack,
        onSwipedUp: onClose,
        onSwipedDown: onClose,
        preventScrollOnSwipe: true
    })

    return (
        <Modal 
            open={true} 
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
                    src={`${images[index]}`} 
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
                    onBackClick={onNavigateBack}
                    onForwardClick={onNavigateNext}
                />
                <span style={{
                    position: "absolute",
                    top:"17px",
                    left: "15px",
                    fontSize: "x-large",
                    opacity: 0.5
                }}>
                    {index + 1}/{images.length}
                </span>
            </div>
        </Modal>
    )
}

function NavigationButtons( {
    hide, 
    onBackClick, 
    onForwardClick
}: {
    hide: boolean, 
    onBackClick: VoidFunction, 
    onForwardClick: VoidFunction
}) {

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