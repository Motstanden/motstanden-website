import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme, } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useMatch } from 'react-router-dom';
import { useAppTheme } from 'src/context/Themes';
import { isElementInViewport } from "src/utils/isElementInViewport";

const listItemButtonSx = (theme: Theme): SxProps => ({
    borderRadius: "10px",
    px: {xs: 1.25, sm: 2},
    "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main
        },
        color: theme.palette.primary.contrastText,
    },
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    }   
})

export function ListItemLink({
    to,
    text,
    externalRoute,
    icon,
    onLinkClick,
    activate,
}: {
    to: string
    text: string
    onLinkClick: VoidFunction
    externalRoute?: boolean
    icon?: React.ReactNode
    activate?: boolean
}) {
    const urlAttribute = externalRoute ? { href: to } : { to: to }
    const { theme } = useAppTheme()
    
    const matchesPathTo = !!useMatch(to + "/*")
    const isActive = activate || matchesPathTo

    return (
        <ListItem sx={{
            px: {xs: 1.5, sm: 2}
        }}>
            <ListItemButton
                component={externalRoute ? "a" : RouterLink}
                {...urlAttribute}
                onClick={onLinkClick}
                selected={isActive}
                sx={listItemButtonSx(theme)}
                >
                <ListItemIcon sx={{ 
                    minWidth: "0px", 
                    paddingRight: "10px", 
                    color: isActive ? theme.palette.primary.contrastText : undefined,
                }}>
                    {icon}
                </ListItemIcon>
                <ListItemText 
                    primary={text}
                    disableTypography
                    style={{
                        fontWeight: isActive ? "bold" : undefined,
                    }}
                    />
            </ListItemButton>
        </ListItem>
    )
}

export function ListItemExpander({ 
    text, 
    dense,
    iconFontSize,
    startsOpen, 
    children,
}: { 
    text: string,
    dense: boolean,
    iconFontSize: "small" | "medium",
    startsOpen?: boolean, 
    children: React.ReactNode 
}) {
    const [isOpen, setIsOpen] = useState(startsOpen ?? false)
    const [isExpanding, setIsExpanding] = useState(false)       // True if the list is currently opening, otherwise false
    const { theme } = useAppTheme()

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
            <ListItem sx={{
                px: {xs: 1.5, sm: 2}
            }}>
                <ListItemButton 
                    onClick={() => setIsOpen(!isOpen)} 
                    sx={listItemButtonSx(theme)}
                >
                    <ListItemIcon sx={{ minWidth: "0px", paddingRight: "10px" }}>
                        { isOpen 
                        ? <ExpandLess fontSize={iconFontSize} /> 
                        : <ExpandMore fontSize={iconFontSize} />}
                    </ListItemIcon>
                    <ListItemText primary={text} disableTypography/>
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
                    disablePadding 
                    sx={{ pl: 4}}
                    dense={dense}
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