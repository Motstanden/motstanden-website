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
import { SxProps } from '@mui/material';

import { useAuth } from '../routes/login/Authentication';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <Link href="/hjem" sx={linkStyle}>
                Hjem
            </Link>
            <Link href="/notearkiv" sx={linkStyle}>
                Notearkiv
            </Link>
            <Link href="/studenttraller" sx={linkStyle}>
                Studenttraller
            </Link>
            <Link href="/dokumenter" sx={linkStyle}>
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
            <Link href="/bli-medlem" sx={linkStyle}>
                Bli Medlem
            </Link>
            <Link href="/studenttraller" sx={linkStyle}>
                Studenttraller
            </Link>
            <Link href="/dokumenter" sx={linkStyle}>
                Dokumenter
            </Link>
        </nav>
    )
}


function MobileToolBar() {
    return ( 
        <Container sx={{width: "100%"}}>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 0, justifyContent: "flext-start"}}>
                    <IconButton
                        size="small"
                        color="inherit"
                        >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Title 
                    variant='h6' 
                    sx={{
                        display: "flex", 
                        mt: 1,
                        mb: 1,
                        flexGrow: 1,
                        justifyContent: 'center' 
                        }}
                />
                <LoginStatus sx={{justifyContent: "flex-end"}}/>  
            </Toolbar>
        </Container>   
    )
}

type VariantType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit" | undefined

interface TitleProps {
    variant: VariantType,
    sx?: SxProps | undefined
}

function Title(props: TitleProps) {

	return (
		<>
            <Typography
                noWrap
                component="a"
                href="/"
                variant={props.variant}
                sx={{
                    flexGrow: 0,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    ...props.sx
                }}
            >
                <AdbIcon sx={{mt: 0.5}}/>
                MOTSTANDEN
            </Typography>
		</>
	)
}

function LoginStatus(sx: SxProps | undefined){
    let auth = useAuth()
    return  (
        <Box sx={{ flexGrow: 0, ...sx }}>
            {auth.user ? <UserAvatar/> : <LoginButton/> }
        </Box>
    )
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
            <IconButton onClick={handleClick}
                >
                <Avatar alt={username}/>
            </IconButton>
        </Tooltip>
        <Menu 
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
            href="/logg-inn" 
            sx={{
                color: "inherit",
                fontWeight: 300,
            }}
        >
            Logg inn
        </Link>
    )
}