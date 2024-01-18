import CloseIcon from '@mui/icons-material/Close';
import { Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, SxProps, Toolbar } from "@mui/material";
import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from "src/context/Authentication";
import * as MenuIcons from 'src/layout/appBar/MenuIcons';
import { isElementInViewport } from "src/utils/isElementInViewport";
import { ThemeSwitchButton } from "./appBar/SideDrawer";

interface SideDrawerContentProps {
    onRequestedExit?: VoidFunction
}

export function SideDrawer( {
    open: mobileOpen,
    onOpen,
    onClose,
    drawerWidth,
    headerHeight,
}: {
    open: boolean,
    onOpen: VoidFunction,
    onClose: VoidFunction,
    headerHeight: number,
    drawerWidth: number,
}) {
    return (
        <>
            {/* Desktop drawer */}
            <Drawer 
                open={true}             // Desktop is always open 
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
                }}
                >
                <DrawerContent 
                    mobileHeaderHeight={headerHeight} 
                    onRequestedExit={onClose}
                    />
            </Drawer>

            {/* Mobile drawer */}
            <SwipeableDrawer
                anchor='left'
                open={mobileOpen}
                onClose={onClose}
                onOpen={onOpen}
                swipeAreaWidth={400}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <DrawerContent 
                    mobileHeaderHeight={headerHeight} 
                    onRequestedExit={onClose} 
                />
            </SwipeableDrawer>
        </>
    )
}

function DrawerContent({ 
    mobileHeaderHeight, 
    onRequestedExit 
}: {
    mobileHeaderHeight: number, 
    onRequestedExit?: VoidFunction
}) {
    return (
        <>
            <MobileHeader 
                onRequestedExit={onRequestedExit}
                sx={{ 
                    display: { xs: "flex", sm: "none" },
                    height: `${mobileHeaderHeight - 1}px`,
                }}/>
            <ListItemDivider sx={{ display: {xs: "flex", sm: "none" }}}/>
            <NavContentSelector onRequestedExit={onRequestedExit}/>
        </>
    )   
}

function MobileHeader({ onRequestedExit, sx }: {onRequestedExit?: VoidFunction, sx?: SxProps}) {
    return (
        <Toolbar sx={{
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingLeft: "25px",
            paddingRight: "25px",
            ...sx
        }}>
            <ThemeSwitchButton fontSize='medium'/>
            <IconButton onClick={onRequestedExit}>
                <CloseIcon />
            </IconButton>
        </Toolbar>
    )
}

function NavContentSelector({ onRequestedExit }: SideDrawerContentProps) {
    const auth = useAuth()
    return auth.user
        ? <PrivateNavContent onRequestedExit={onRequestedExit} />
        : <PublicNavContent onRequestedExit={onRequestedExit} />
}

function PublicNavContent({onRequestedExit}: SideDrawerContentProps) {
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

function PrivateNavContent({onRequestedExit}: SideDrawerContentProps) {
    const { user } = useAuth();
    const isSuperAdmin = hasGroupAccess(user!, UserGroup.SuperAdministrator)

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

            {isSuperAdmin && (
                <ListItemExpander text="Medlem">
                    <ListItemLink text="Ny" to="/medlem/ny" onLinkClick={onRequestedExit} icon={<MenuIcons.MemberAdd />} />
                    <ListItemLink text="Liste" to="/medlem/liste" onLinkClick={onRequestedExit} icon={<MenuIcons.MemberList />} />
                </ListItemExpander>
            )}

            {!isSuperAdmin && (
                <ListItemLink text="Medlemmer" to="/medlem/liste" onLinkClick={onRequestedExit} icon={<MenuIcons.MemberList />}/>
            )}

            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onRequestedExit} icon={<MenuIcons.FrontPage />} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit} icon={<MenuIcons.BecomeMember />} />
                <ListItemLink text="Lisens" to="/lisens" onLinkClick={onRequestedExit} icon={<MenuIcons.License />} />
            </ListItemExpander>
        </List>
    )
}

function ListItemLink({
    to,
    text,
    externalRoute,
    icon,
    onLinkClick,
}: {
    to: string
    text: string
    externalRoute?: boolean
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

function ListItemDivider( {sx}: {sx?: SxProps}) {
    return <Divider sx={{ opacity: 1 }} />   
}