import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/Authentication';

// Material UI 
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemLink from './ListItemLink';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { SxProps } from '@mui/system';

import { hasGroupAccess } from 'common/utils';
import { UserGroup } from 'common/enums';


export function NavBar(){
    let auth = useAuth()
    return auth.user 
        ? <PrivateNavBar/> 
        : <PublicNavBar/>
}

function PrivateNavBar(){
    return (
        <Stack 
            component="nav"
            direction="row"
            alignItems="center"
            justifyContent={{lg: "flex-start", xl: "center"}}
            sx={{width: "100%", maxWidth: "1200px"}}
            spacing={{sm: 1, md: 1, lg: 4, xl: 6}}
            >
            <NavLink text="Hjem" to="/hjem"/>
            <NavLink text="Notearkiv" to="/notearkiv"/>
            <NavLink text="Sitater" to="/sitater"/>
            <NavLink text="Studenttraller" to="/studenttraller"/>
            <NavLink text="Arrangement" to="/arrangement" />
            <NavLink text="Dokumenter" to="/dokumenter" />
            <AdminDropDown/>
            <NavDropDown text="Om oss">
                <List component="nav" disablePadding sx={{minWidth: 200}}>
                    <ListItemLink text="Framside" to="/framside"/>
                    <Divider/>
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" />
                    {/* <ListItemLink text="FAQ" to="/faq" disabled /> */}
                    <Divider/>
                    <ListItemLink text="Lisens" to="/lisens" />
                    <Divider/>
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/"/>
                </List>
            </NavDropDown>
        </Stack>
    )
}

function PublicNavBar(){
    return (
        <Stack 
            component="nav"
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={{md: 6, lg: 12, xl: 16 }}
            >
            <NavDropDown text="Om oss" sx={{mr: -2}}>
                <List component="nav" disablePadding sx={{minWidth: 200}}>
                    <ListItemLink text="Framside" to="/"/>
                    <Divider/>
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" />
                    {/* <ListItemLink text="FAQ" to="/faq" disabled /> */}
                                        <Divider/>
                    <ListItemLink text="Lisens" to="/lisens" />
                    <Divider/>
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/"/>
                </List>
            </NavDropDown>
            <NavLink text="Studenttraller" to="/studenttraller"/>
            <NavLink text="Dokumenter" to="/dokumenter"/>
        </Stack>
    )
}

function AdminDropDown() {
    const user = useAuth().user!
    if(hasGroupAccess(user, UserGroup.SuperAdministrator)) {
        return (
            <NavDropDown text="Medlem" sx={{pr: 0}}>
                <List component="nav" disablePadding sx={{minWidth: 200}}>
                    <ListItemLink text="Ny" to="/medlem/ny"/>
                    <Divider/>
                    <ListItemLink text="Liste" to="/medlem/liste"/>
                </List>
            </NavDropDown>
        )
    }

    return ( 
        <NavLink text="Medlemmer" to="/medlem/liste"/>
    )

}

export function NavLink( { to, text, sx }: { to: string, text: string, sx?: SxProps}) {
    return (
        <Link 
            component={RouterLink}
            to={to}
            underline="hover"
            sx={{
                color: "inherit",
                pl: 1,
                ...sx
            }}
        >
            {text}
        </Link>
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