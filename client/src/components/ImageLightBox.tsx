import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton, Modal, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';

export function ImageLightBox( {
    images, 
    onClose,
    open,
    openIndex, 
}: {
    images: string[], 
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
                    src={`${images[index ?? openIndex]}`} 
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