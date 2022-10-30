import { useState } from 'react';

// Material UI 
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListItemLink from './ListItemLink';

import MotstandenImg from "../../assets/logos/motstanden.png";

import { UserGroup } from 'common/enums';
import { hasGroupAccess } from 'common/utils';
import { useAuth } from '../../context/Authentication';
import * as MenuIcons from './MenuIcons';
import ThemeSwitcher from './ThemeSwitcher';




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

function ContentPicker(props: SideDrawerContentProps) {
    const auth = useAuth()
    return auth.user
        ? <PrivateContent onRequestedExit={props.onRequestedExit} />
        : <PublicContent onRequestedExit={props.onRequestedExit} />
}

function PublicContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List sx={{ minWidth: 230 }} >
            <ListItemHeader />
            <ListItemExpander text="Om oss" startsOpen>
                <ListItemLink text="Framside" to="/" onLinkClick={onRequestedExit} icon={<MenuIcons.FrontPage />} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit} icon={<MenuIcons.BecomeMember />} />
                {/* <ListItemLink text="FAQ" to="/faq" disabled onLinkClick={onRequestedExit}/> */}
                <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" icon={<MenuIcons.Wiki />} />
            </ListItemExpander>
            <ListItemLink text="Studenttraller" to="/studenttraller" onLinkClick={onRequestedExit} icon={<MenuIcons.Lyric />} />
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit} icon={<MenuIcons.Documents />} />
            <ListItemLink externalRoute text="Lisens" to="/lisens" onLinkClick={onRequestedExit} icon={<MenuIcons.License />} />
            <ListItemThemeSwitcher />
        </List>
    )
}

function PrivateContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List sx={{ minWidth: 230 }} >
            <ListItemHeader />
            <ListItemLink text="Hjem" to="/hjem" onLinkClick={onRequestedExit} icon={<MenuIcons.Home />} />
            <ListItemLink text="Arrangement" to="/Arrangement" onLinkClick={onRequestedExit} icon={<MenuIcons.Event />} />
            <ListItemLink text="Sitater" to="/sitater" onLinkClick={onRequestedExit} icon={<MenuIcons.Quotes />} />
            <ListItemLink text="Rykter" to="/rykter" onLinkClick={onRequestedExit} icon={<MenuIcons.Rumour />} />
            <Divider light sx={{ ml: 2, mr: 4, opacity: 0.7 }} />
            <ListItemLink text="Noter" to="/notearkiv" onLinkClick={onRequestedExit} icon={<MenuIcons.SheetArchive />} />
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onRequestedExit} icon={<MenuIcons.Lyric />} />
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit} icon={<MenuIcons.Documents />} />
            <Divider light sx={{ ml: 2, mr: 4, opacity: 0.7 }} />
            <MemberList onLinkClick={onRequestedExit} />
            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onRequestedExit} icon={<MenuIcons.FrontPage />} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit} icon={<MenuIcons.BecomeMember />} />
                {/* <ListItemLink text="FAQ" to="/faq" disabled onLinkClick={onRequestedExit}/> */}
                <ListItemLink externalRoute text="Lisens" to="/lisens" onLinkClick={onRequestedExit} icon={<MenuIcons.License />} />
                <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onRequestedExit} icon={<MenuIcons.Wiki />} />
            </ListItemExpander>
            <ListItemThemeSwitcher />
        </List>
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

function ListItemHeader() {
    return (
        <>
            <ListItem>
                <ListItemIcon >
                    <img src={MotstandenImg} style={{ width: "40px" }} loading="lazy" />
                </ListItemIcon>
                <ListItemText >Motstanden</ListItemText>
            </ListItem>
            <Divider light={false} />
        </>
    )
}

function ListItemExpander({ text, startsOpen, children }: { text: string, startsOpen?: boolean, children: JSX.Element | JSX.Element[] }) {
    const [isOpen, setIsOpen] = useState(startsOpen)
    return (
        <>
            <ListItemButton onClick={() => setIsOpen(!isOpen)}>
                <ListItemText primary={text} />
                {isOpen ? <MenuIcons.ExpandLess /> : <MenuIcons.ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                    {children}
                </List>
            </Collapse>
        </>
    )
}

// TODO
function ListItemThemeSwitcher() {
    return (
        <>
            <Divider light={false} />
            <ListItem>
                <ThemeSwitcher />
            </ListItem>
            <Divider light={false} />
        </>
    )
}