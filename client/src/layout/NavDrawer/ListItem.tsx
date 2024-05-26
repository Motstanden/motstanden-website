import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useMatch } from 'react-router-dom';
import { useAppTheme } from 'src/context/AppTheme';
import { isElementInViewport } from "src/utils/isElementInViewport";

const listItemButtonSx = (theme: Theme): SxProps => ({
    borderRadius: "10px",
    py: {xs: 0.35, sm: 0.65},
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
    matchPattern,
}: {
    to: string
    text: string
    onLinkClick: VoidFunction
    externalRoute?: boolean
    icon?: React.ReactNode
    activate?: boolean,
    matchPattern?: string
}) {
    const urlAttribute = externalRoute ? { href: to } : { to: to }
    const { theme } = useAppTheme()

    const matchesPathTo = !!useMatch(matchPattern ?? `${to}/*`)
    const isActive = activate || matchesPathTo

    return (
        <ListItem sx={{
            px: {xs: 1.5, sm: 2},
            py: "2px"
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
                {externalRoute && (
                    <ListItemIcon sx={{minWidth: 0, opacity: 0.55}} >
                        <LaunchIcon fontSize="small" />
                    </ListItemIcon>                        
                )}
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
                px: {xs: 1.5, sm: 2},
                py: "2px"
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

export function ListItemHeader( {title}: {title?: string}) {
    return (
        <Typography
            sx={{
                fontSize: "8pt",
                fontWeight: "bold",
                opacity: 0.6,
                textTransform: "uppercase",
                marginTop: {xs: "8px", sm: "16px"},
                px: {xs: 0.75, sm: 2},
                mx: 2,
            }}
        >
            {title}
        </Typography>
    )
}