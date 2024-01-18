import React from 'react';

// Material UI 
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SxProps
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

export default function ListItemLink({
    to,
    text,
    externalRoute,
    icon,
    onLinkClick,
}: {
    to: string
    text: string
    externalRoute?: boolean
    sx?: SxProps
    icon?: React.ReactNode
    onLinkClick?: VoidFunction
}) {
    const urlAttribute = externalRoute ? { href: to } : { to: to }
    return (
        <ListItem>
            <ListItemButton
                component={externalRoute ? "a" : RouterLink}
                {...urlAttribute}
                onClick={onLinkClick}
                >
                <ListItemIcon sx={{ minWidth: "0px", paddingRight: "10px" }}>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    )
}