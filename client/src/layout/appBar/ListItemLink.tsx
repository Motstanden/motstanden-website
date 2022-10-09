import React from 'react';

// Material UI 
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link as RouterLink } from 'react-router-dom';
import { SxProps } from '@mui/system';


interface ListItemLinkProps {
    to: string
    text: string
    externalRoute?: boolean
    disabled?: boolean 
    sx?: SxProps
    icon?: React.ReactNode
    onLinkClick?: VoidFunction
}

export default function ListItemLink(props: ListItemLinkProps){
    const { 
        to, 
        text, 
        externalRoute, 
        disabled, 
        sx, 
        icon,
        onLinkClick 
    } = props
    
    let urlAttribute = externalRoute ? { href: to } : { to: to}
    return (
        <ListItem 
            button 
            component={externalRoute ? "a" : RouterLink}
            {...urlAttribute}
            disabled={disabled}
            sx={sx}
            onClick={onLinkClick}
            >
            <ListItemIcon sx={{minWidth: "0px", paddingRight: "10px"}}>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItem>
    )
}