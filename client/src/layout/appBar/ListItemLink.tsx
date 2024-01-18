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


interface ListItemLinkProps {
    to: string
    text: string
    externalRoute?: boolean
    disabled?: boolean
    sx?: SxProps
    icon?: React.ReactNode
    onLinkClick?: VoidFunction
}

export default function ListItemLink(props: ListItemLinkProps) {
    const {
        to,
        text,
        externalRoute,
        icon,
        onLinkClick
    } = props
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