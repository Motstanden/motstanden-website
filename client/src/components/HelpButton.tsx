import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import { useRef, useState } from 'react';

export function HelpButton({ text }: { text: string }) {

    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    return (
        <>
            <IconButton ref={anchorEl} onClick={() => setIsOpen(!isOpen)}>
                <HelpOutlineIcon fontSize="large" color="secondary" />
            </IconButton>
            <Menu
                anchorEl={anchorEl.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div style={{ margin: "10px", maxWidth: "280px" }}>
                    {text}
                </div>
            </Menu>
        </>
    )
}