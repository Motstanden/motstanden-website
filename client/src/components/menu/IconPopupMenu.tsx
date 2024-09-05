import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ClickAwayListener, IconButton, Menu, PopoverOrigin, SxProps } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

export function IconPopupMenu({
    children,
    icon = "horizontal",
    disabled,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose,
    onClick,
    ariaLabel,
    style,
    sx,
    menuSx,
    transformOrigin = { horizontal: 'right', vertical: 'top' },
    anchorOrigin = { horizontal: 'right', vertical: 'bottom' },
    elevation,
}: {
    children: React.ReactNode,
    icon?: React.ReactNode | "horizontal" | "vertical",
    disabled?: boolean,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    ariaLabel?: string
    style?: React.CSSProperties
    sx?: SxProps,
    menuSx?: SxProps,
    transformOrigin?: PopoverOrigin,
    anchorOrigin?: PopoverOrigin,
    elevation?: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)
    useEffect(() => {
        if (anchorEl && isOpen) {
            onMenuOpen && onMenuOpen()
        }
        if (anchorEl && !isOpen) {
            onMenuClose && onMenuClose()
        }
    }, [isOpen])

    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => { 
        setIsOpen(prevValue => !prevValue)
        onClick?.(event)
    }

    let menuIcon = icon
    if(icon === "horizontal")  
        menuIcon = <MoreHorizIcon/>
    else if(icon === "vertical") 
        menuIcon === <MoreVertIcon/>

    return (
        <>
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <IconButton
                    ref={anchorEl}
                    onClick={onClickHandler}
                    disabled={disabled}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    aria-label={ariaLabel}
                    style={style}
                    sx={sx}
                >
                    {menuIcon}
                </IconButton>
            </ClickAwayListener>
            <Menu
                anchorEl={anchorEl.current}
                open={!disabled && isOpen}
                onClose={() => setIsOpen(false)}
                transformOrigin={transformOrigin}
                anchorOrigin={anchorOrigin}
                elevation={elevation}
                sx={{
                    ".MuiMenu-paper": {
                        scrollbarWidth: "thin",
                        scrollbarColor: `#959595 transparent`,
                    },
                    ...menuSx
                }}
            >
                {children}
            </Menu>
        </>
    )
}