import ClickAwayListener  from "@mui/material/ClickAwayListener";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import React, { useRef, useState } from "react";

export function IconPopupMenu( {children, icon}: {children: React.ReactNode, icon: React.ReactNode}){
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)
    return (
        <>
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <IconButton ref={anchorEl} onClick={() => setIsOpen( prevValue => !prevValue)}>
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