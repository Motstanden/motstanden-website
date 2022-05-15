import React, { useRef, useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { SxProps } from '@mui/system';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useAuth } from "../../routes/login/Authentication"
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';


export default function NavBar(){
    let auth = useAuth()
    return (
        <nav>
            {auth.user ? <PrivateNavBar/> : <PublicNavBar/>}
        </nav>
    )
}

function PrivateNavBar(){
    return (
        <Stack 
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            >
            <NavLink text="Hjem" to="/hjem"/>
            <NavLink text="Notearkiv" to="/notearkiv"/>
            <NavLink text="Studenttraller" to="/studenttraller"/>
            <NavLink text="Dokumenter" to="/dokumenter"/>
            <NavDropDown text="Om oss">
                <List component="nav" disablePadding sx={{minWidth: 200}}>
                    <ListItemLink text="Framside" to="/"/>
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" />
                    <ListItemLink text="FAQ" to="/faq" disabled />
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/"/>
                </List>
            </NavDropDown>
        </Stack>
    )
}

function PublicNavBar(){
    return (
        <Stack 
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={4}
            >
            <NavDropDown text="Om oss">
                <List component="nav" disablePadding sx={{minWidth: 200}}>
                    <ListItemLink text="Framside" to="/"/>
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" />
                    <ListItemLink text="FAQ" to="/faq" disabled />
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/"/>
                </List>
            </NavDropDown>
            <NavLink text="Studenttraller" to="/studenttraller"/>
            <NavLink text="Dokumenter" to="/dokumenter"/>
        </Stack>
    )
}

function NavLink( { to, text, sx }: { to: string, text: string, sx?: SxProps}) {
    return (
        <Link 
            component={RouterLink}
            to={to}
            sx={{
                color: "inherit",
                ...sx
            }}
        >
            {text}
        </Link>
    )
}

function ListItemLink({ to, text, externalRoute, disabled }: {to: string, text: string, externalRoute?: boolean, disabled?: boolean }){
    let urlAttribute = externalRoute ? { href: to } : { to: to}
    return (
        <ListItem 
            button 
            component={externalRoute ? "a" : RouterLink}
            {...urlAttribute}
            disabled={disabled}
            >
            <ListItemText primary={text}/>
        </ListItem>
    )
}

function NavDropDown({ text, sx, children }: {text: string, sx?: SxProps, children?: JSX.Element}) {
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    // Close menu when url changes
    const location = useLocation();
    useEffect(() => setIsOpen(false), [location]);

    return (
        <>
            <Button
                ref={anchorEl}
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    textTransform: "none",
                    color: "inherit",
                    ...sx
                }}
                >
                <Typography variant="subtitle1">
                    {text}
                </Typography>
                {isOpen ? <ExpandLess/> : <ExpandMore/>}
            </Button>
            <Menu 
                anchorEl={anchorEl.current}
                open={isOpen}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                onClose={() => setIsOpen(false)}
                >
                    {children}
            </Menu>
        </>
    )
}