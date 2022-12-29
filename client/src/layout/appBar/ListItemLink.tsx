import React from 'react';

// Material UI 
import {
    ListItem,
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
        disabled,
        sx,
        icon,
        onLinkClick
    } = props

    const urlAttribute = externalRoute ? { href: to } : { to: to }
    return (
        <ListItem
            button
            component={externalRoute ? "a" : RouterLink}
            {...urlAttribute}
            disabled={disabled}
            sx={{
                '& .MuiSvgIcon-root': {
                    // Target icon properties here
                    // fontSize: "x-large"
                },
                ...sx
            }}
            onClick={onLinkClick}
        >
            <ListItemIcon sx={{ minWidth: "0px", paddingRight: "10px" }} style={{ fontSize: "tiny" }} >
                {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    )
}