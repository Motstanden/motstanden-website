import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { isElementInViewport } from "src/utils/isElementInViewport";

export function ListItemLink({
    to,
    text,
    externalRoute,
    icon,
    onLinkClick,
}: {
    to: string
    text: string
    onLinkClick: VoidFunction
    externalRoute?: boolean
    icon?: React.ReactNode
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

export function ListItemExpander({ 
    text, 
    startsOpen, 
    children 
}: { 
    text: string, 
    startsOpen?: boolean, 
    children: React.ReactNode 
}) {
    const [isOpen, setIsOpen] = useState(startsOpen ?? false)
    const [isExpanding, setIsExpanding] = useState(false)       // True if the list is currently opening, otherwise false

    useEffect(() => setIsExpanding(isOpen), [isOpen])

    const contentRef = useRef<HTMLDivElement>(null)

    const onTransitionEnd = () => {
        if(isExpanding) {
            setIsExpanding(false)  
            
            const inView = isElementInViewport(contentRef.current)
            if(!inView) {
                contentRef.current?.scrollIntoView({behavior: 'smooth', block: "end"})
            }
        }
    }

    return (
        <>
            <ListItem>
                <ListItemButton onClick={() => setIsOpen(!isOpen)}>
                    <ListItemIcon sx={{ minWidth: "0px", paddingRight: "10px" }}>
                        { isOpen 
                        ? <ExpandLess /> 
                        : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
            <Collapse 
                in={isOpen} 
                timeout="auto"
                onTransitionEnd={onTransitionEnd}
                ref={contentRef}
                >
                <List 
                    component="div" 
                    disablePadding sx={{ pl: 4 }}
                    >
                    {children}
                </List>
            </Collapse>
        </>
    )
}

export function ListItemDivider( {sx}: {sx?: SxProps}) {
    return <Divider sx={{ opacity: 1, ...sx }} />   
}