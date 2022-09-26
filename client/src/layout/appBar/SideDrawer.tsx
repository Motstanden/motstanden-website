import React, { useEffect, useRef, useState } from 'react';

// Material UI 
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemLink from './ListItemLink';
import ListItemIcon  from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import MotstandenImg from "../../assets/logos/motstanden.png"

import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../../context/Authentication';
import { hasGroupAccess } from 'common/utils';
import { UserGroup } from 'common/enums';




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
                    <ContentPicker onRequestedExit={() => setIsOpen(false)}/>
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
        ? <PrivateContent onRequestedExit={props.onRequestedExit}/> 
        : <PublicContent onRequestedExit={props.onRequestedExit}/>
}

function PublicContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List sx={{minWidth: 230}} >
            <ListItemHeader/>
            <ListItemExpander text="Om oss" startsOpen>
                <ListItemLink text="Framside" to="/" onLinkClick={onRequestedExit}/>
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit}/>
                {/* <ListItemLink text="FAQ" to="/faq" disabled onLinkClick={onRequestedExit}/> */}
                <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/"/>
            </ListItemExpander>
            <ListItemLink text="Studenttraller" to="/studenttraller" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit}/>
            <ListItemLink externalRoute text="Lisens" to="/lisens"  onLinkClick={onRequestedExit}/>
            <ListItemThemeSwitcher/>
        </List>
    )
}

function PrivateContent(props: SideDrawerContentProps) {
    const { onRequestedExit } = props
    return (
        <List sx={{minWidth: 230}} >
            <ListItemHeader/>
            <ListItemLink text="Hjem" to="/hjem" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Arrangement" to="/Arrangement" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Sitater" to="/sitater" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Ryktebørsen" to="/rykter" onLinkClick={onRequestedExit}/>
            <Divider/>
            <ListItemLink text="Notearkiv" to="/notearkiv" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Studenttraller" to="/studenttraller" onLinkClick={onRequestedExit}/>
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onRequestedExit}/>
            <Divider/>
            <MemberList onLinkClick={onRequestedExit} />
            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onRequestedExit}/>
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onRequestedExit}/>
                {/* <ListItemLink text="FAQ" to="/faq" disabled onLinkClick={onRequestedExit}/> */}
                <ListItemLink externalRoute text="Lisens" to="/lisens"  onLinkClick={onRequestedExit}/>
                <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onRequestedExit}/>
            </ListItemExpander>
            <ListItemThemeSwitcher/>
        </List>
    )
}

function MemberList( {onLinkClick} : {onLinkClick?: VoidFunction}) {
    const user = useAuth().user!

    if(hasGroupAccess(user, UserGroup.SuperAdministrator)) {
        return (
            <ListItemExpander text="Medlem">
                <ListItemLink text="Ny" to="/medlem/ny" onLinkClick={onLinkClick}/>
                <ListItemLink text="Liste" to="/medlem/liste" onLinkClick={onLinkClick}/>
            </ListItemExpander>
        )
    }

    return (
        <ListItemLink text="Medlemmer" to="/medlem/liste" onLinkClick={onLinkClick}/>
    )
}

function ListItemHeader(){
    return (
        <>
            <ListItem>
                <ListItemIcon >
                    <img src={MotstandenImg} style={{width: "40px"}} loading="lazy"/>
                </ListItemIcon>
                <ListItemText >Motstanden</ListItemText>
            </ListItem>
            <Divider light={false}/>
        </>
    )
}

function ListItemExpander({ text, startsOpen, children }: { text: string, startsOpen?: boolean, children: JSX.Element | JSX.Element[] }){
    const[isOpen, setIsOpen] = useState(startsOpen)
    return (
        <>
            <ListItemButton onClick={() => setIsOpen(!isOpen)}>
                <ListItemText primary={text}/>
                {isOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{pl: 4}}>
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
            <Divider light={false}/>
            <ListItem>
                <ThemeSwitcher/>
            </ListItem>
            <Divider light={false}/>
        </>
    )
}