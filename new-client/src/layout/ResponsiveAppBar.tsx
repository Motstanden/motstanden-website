import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from '@mui/material/Link';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



import { SxProps } from '@mui/material';

import { useAuth } from '../routes/login/Authentication';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function ResponsiveAppBar(){
    return (
        <AppBar position="static" >
            <Box display={{ xs: 'none', md: 'flex' }} >
                <DesktopToolbar/>
            </Box>
            <Box display={{ xs: 'flex', md: 'none' }} >
                <MobileToolBar/>
            </Box>
        </AppBar>
    );
};

function DesktopToolbar(){

    return ( 
        <Container maxWidth="xl">
            <Toolbar disableGutters >
                <Title 
                    variant='h5' 
                    sx={{
                        display: "flex", 
                        my: 2, 
                        mr: 4
                        }}
                />
                <Box sx={{ flexGrow: 3, display: "flex"}}>
                    <NavBar/>
                </Box>
                <LoginStatus/>  
            </Toolbar>
        </Container>
    )
}

function NavBar(){
    let auth = useAuth()
    return auth.user ? <LoggedInNavBar/> : <LoggedOutNavBar/>
}

function LoggedInNavBar(){

    const linkStyle: SxProps = {                    
        color: 'inherit',
        mr: 5,
    }

    return (
        <nav>
            <Link component={RouterLink} to="/hjem" sx={linkStyle}>
                Hjem
            </Link>
            <Link component={RouterLink} to="/notearkiv" sx={linkStyle}>
                Notearkiv
            </Link>
            <Link component={RouterLink} to="/studenttraller" sx={linkStyle}>
                Studenttraller
            </Link>
            <Link component={RouterLink} to="/dokumenter" sx={linkStyle}>
                Dokumenter
            </Link>
        </nav>
    )
}

function LoggedOutNavBar(){

    const linkStyle: SxProps = {                    
        color: 'inherit',
        mr: 5,
    }

    return (
        <nav>
            <Link component={RouterLink} to="/bli-medlem" sx={linkStyle}>
                Bli Medlem
            </Link>
            <Link component={RouterLink} to="/studenttraller" sx={linkStyle}>
                Studenttraller
            </Link>
            <Link component={RouterLink} to="/dokumenter" sx={linkStyle}>
                Dokumenter
            </Link>
        </nav>
    )
}


function MobileToolBar() {
    return ( 
        <Container>
            <Toolbar  disableGutters sx={{display: "flex", justifyContent: "space-between"}}>
                <SideDrawer/>
                <Title variant='h6'/>
                <LoginStatus/>  
            </Toolbar>
        </Container>   
    )
}

function SideDrawer() {
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
                    <SideDrawerContent onClick={() => setIsOpen(false)}/>
            </SwipeableDrawer>
        </>
    )
}

interface SideDrawerProps {
    onClick: VoidFunction
}


function SideDrawerContent(props: SideDrawerProps) {
    let auth = useAuth()
    return auth.user ? <LoggedInDrawerContent onClick={props.onClick}/> : <LoggedOutDrawerContent onClick={props.onClick}/>
}

function LoggedInDrawerContent(props: SideDrawerProps) {
    return (
        <List>
            <ListItem button component={RouterLink} to="/hjem" onClick={props.onClick}>
                <ListItemText>Hjem</ListItemText>
            </ListItem>

            <ListItem button component={RouterLink} to="/studenttraller" onClick={props.onClick}>
                <ListItemText>Studenttraller</ListItemText>
            </ListItem>
            
            <ListItem button component={RouterLink} to="/dokumenter" onClick={props.onClick}>
                <ListItemText>Dokumenter</ListItemText>
            </ListItem>

            <ListItem button component={RouterLink} to="/notearkiv" onClick={props.onClick}>
                <ListItemText>Notearkiv</ListItemText>
            </ListItem>
        </List>
    )
}

function LoggedOutDrawerContent(props: SideDrawerProps) {
    return (
        <List>
            <ListItem button component={RouterLink} to="/bli-medlem" onClick={props.onClick}>
                <ListItemText>Bli Medlem</ListItemText>
            </ListItem>

            <ListItem button component={RouterLink} to="/studenttraller" onClick={props.onClick}>
                <ListItemText>Studenttraller</ListItemText>
            </ListItem>
            
            <ListItem button component={RouterLink} to="/dokumenter" onClick={props.onClick}>
                <ListItemText>Dokumenter</ListItemText>
            </ListItem>
        </List>
    )

}



type VariantType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit" | undefined

interface TitleProps {
    variant: VariantType,
    sx?: SxProps | undefined
}

function Title(props: TitleProps) {

	return (
        <Typography
            component={RouterLink}
            to="/"
            noWrap
            variant={props.variant}
            sx={{
                fontFamily: 'monospace',
                py: 1,
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                ...props.sx
            }}
            >
            MOTSTANDEN
        </Typography>
	)
}

function LoginStatus(sx: SxProps | undefined){
    let auth = useAuth()
    return  auth.user ? <UserAvatar/> : <LoginButton/>
}

function UserAvatar() {
    let auth = useAuth()
    let username = auth?.user ?? ""
    
    let navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSignOut = () => {
        auth.signOut( () => navigate("/") )
    }

    return (
        <>
        <Tooltip title={username} >
            <IconButton onClick={handleClick}>
                <Avatar alt={username} sx={{ height: "50px", width: "50px"}}/>
            </IconButton>
        </Tooltip>
        <Menu 
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
            <MenuItem onClick={onSignOut}>
                Logg ut
            </MenuItem>
        </Menu>
        </>
    )
}

function LoginButton(){
    return (
        <Link variant='body1'
            component={RouterLink} to="/logg-inn" 
            sx={{
                color: "inherit",
                fontWeight: 300,
            }}
        >
            Logg inn
        </Link>
    )
}