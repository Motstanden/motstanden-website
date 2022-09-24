import ClickAwayListener  from "@mui/material/ClickAwayListener";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import React, { useEffect, useRef, useState } from "react";

export function IconPopupMenu({
    children, 
    icon,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose
}: {
    children: React.ReactNode, 
    icon: React.ReactNode,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
}){
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)
    useEffect( () => {
        if(anchorEl && isOpen){
            onMenuOpen && onMenuOpen()
        }
        if(anchorEl && !isOpen) {
            onMenuClose && onMenuClose()
        }
    }, [isOpen])
    
    return (
        <>
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <IconButton 
                    ref={anchorEl} 
                    onClick={() => setIsOpen( prevValue => !prevValue)} 
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    >
                    {icon}
                </IconButton>
            </ClickAwayListener>
            <Menu 
                style={{margin: 0, padding: 0}}
                anchorEl={anchorEl.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {children}
            </Menu>
        </>
    )
}