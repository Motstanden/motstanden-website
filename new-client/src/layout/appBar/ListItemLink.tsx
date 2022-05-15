import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { SxProps } from '@mui/system';


interface ListItemLinkProps {
    to: string
    text: string
    externalRoute?: boolean
    disabled?: boolean 
    sx?: SxProps
    onLinkClick?: VoidFunction
}

export default function ListItemLink(props: ListItemLinkProps){
    const { 
        to, 
        text, 
        externalRoute, 
        disabled, 
        sx, 
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
            <ListItemText primary={text}/>
        </ListItem>
    )
}