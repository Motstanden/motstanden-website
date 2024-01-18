import React, { useEffect, useRef, useState } from 'react';

// Material UI 
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import ModeNightSharpIcon from '@mui/icons-material/ModeNightSharp';
import {
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    SxProps,
    Tooltip
} from "@mui/material";
import ListItemLink from './ListItemLink';

import { UserGroup } from 'common/enums';
import { hasGroupAccess } from 'common/utils';
import { ThemeName, useAppTheme } from 'src/context/Themes';
import { isElementInViewport } from 'src/utils/isElementInViewport';
import { useAuth } from '../../context/Authentication';
import * as MenuIcons from './MenuIcons';




export default function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>

            <IconButton
                size="small"
                color="inherit"
                onClick={() => setIsOpen(true)}
            >
                <MenuIcon />
            </IconButton>

            <SwipeableDrawer
                anchor="left"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                disableSwipeToOpen={true}
                swipeAreaWidth={400}
            >
                <ContentPicker onRequestedExit={() => setIsOpen(false)} />
            </SwipeableDrawer>
        </>
    )
}

interface SideDrawerContentProps {
    onRequestedExit?: VoidFunction
}

export function ContentPicker(props: SideDrawerContentProps) {
    const auth = useAuth()
    return auth.user
        ? <PrivateContent onRequestedExit={props.onRequestedExit} />
        : <PublicContent onRequestedExit={props.onRequestedExit} />
}

function PublicContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List sx={{ minWidth: 230 }} >
            <ListItemLink text="Framside" to="/" onLinkClick={onRequestedExit} icon={<MenuIcons.Home />} />
            <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit} icon={<MenuIcons.BecomeMember />} />
            <ListItemDivider/>
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onRequestedExit} icon={<MenuIcons.Lyric />} />
            <ListItemDivider/>
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit} icon={<MenuIcons.Documents />} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onRequestedExit} icon={<MenuIcons.BoardWebsiteList/>} />
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" icon={<MenuIcons.Wiki />} />
            <ListItemDivider/>
            <ListItemLink text="Lisens" to="/lisens" onLinkClick={onRequestedExit} icon={<MenuIcons.License />} />
        </List>
    )
}

function PrivateContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List>
            <ListItemLink text="Hjem" to="/hjem" onLinkClick={onRequestedExit} icon={<MenuIcons.Home />} />
            <ListItemLink text="Arrangement" to="/Arrangement" onLinkClick={onRequestedExit} icon={<MenuIcons.Event />} />
            <ListItemDivider/>
            <ListItemLink text="Sitater" to="/sitater" onLinkClick={onRequestedExit} icon={<MenuIcons.Quotes />} />
            <ListItemLink text="Rykter" to="/rykter" onLinkClick={onRequestedExit} icon={<MenuIcons.Rumour />} />
            <ListItemLink text="Avstemninger" to="/avstemninger" onLinkClick={onRequestedExit} icon={<MenuIcons.Poll />} />
            <ListItemDivider/>
            <ListItemLink text="Noter" to="/notearkiv" onLinkClick={onRequestedExit} icon={<MenuIcons.SheetArchive />} />
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onRequestedExit} icon={<MenuIcons.Lyric />} />
            <ListItemDivider/>
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onRequestedExit} icon={<MenuIcons.Wiki />} />
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit} icon={<MenuIcons.Documents />} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onRequestedExit} icon={<MenuIcons.BoardWebsiteList/>} />
            <ListItemDivider/>
            <MemberList onLinkClick={onRequestedExit} />
            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onRequestedExit} icon={<MenuIcons.FrontPage />} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit} icon={<MenuIcons.BecomeMember />} />
                <ListItemLink text="Lisens" to="/lisens" onLinkClick={onRequestedExit} icon={<MenuIcons.License />} />
            </ListItemExpander>
        </List>
    )
}

function ListItemDivider() {
    return (
        <>
            <Divider sx={{ opacity: 1 }} />
        </>
    )
}

function MemberList({ onLinkClick }: { onLinkClick?: VoidFunction }) {
    const user = useAuth().user!

    if (hasGroupAccess(user, UserGroup.SuperAdministrator)) {
        return (
            <ListItemExpander text="Medlem">
                <ListItemLink text="Ny" to="/medlem/ny" onLinkClick={onLinkClick} icon={<MenuIcons.MemberAdd />} />
                <ListItemLink text="Liste" to="/medlem/liste" onLinkClick={onLinkClick} icon={<MenuIcons.MemberList />} />
            </ListItemExpander>
        )
    }

    return (
        <ListItemLink text="Medlemmer" to="/medlem/liste" onLinkClick={onLinkClick} icon={<MenuIcons.MemberList />}/>
    )
}

function ListItemExpander({ 
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
                        ? <MenuIcons.ExpandLess /> 
                        : <MenuIcons.ExpandMore />}
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

export function ThemeSwitchButton( {
    style, 
    sx,
    fontSize = "inherit"
}: {
    style?: React.CSSProperties, 
    sx?: SxProps,
    fontSize?: "small" | "inherit" | "medium" | "large"
}) {

    const theme = useAppTheme()

    const isDarkMode = () => theme.name === ThemeName.Dark

    const onClick = () => {
        const newTheme = isDarkMode() ? ThemeName.Light : ThemeName.Dark
        theme.changeTheme(newTheme)
    }

    return (
        <Tooltip title={isDarkMode() ? "Bytt til Dagmodus" : "Bytt til Nattmodus"}>
            <IconButton 
                onClick={onClick} 
                style={style} 
                sx={sx}> 
                {isDarkMode() ? <ModeNightSharpIcon fontSize={fontSize}/> : <LightModeIcon fontSize={fontSize}/>}
            </IconButton>
        </Tooltip>
    )
}