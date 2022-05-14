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
import { SxProps } from '@mui/material';
import Link from '@mui/material/Link';
import { useAuth } from '../routes/login/Authentication';
// import { Link } from "react-router-dom"

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
            </Toolbar>
        </Container>
    )
}

function NavBar(){
    let auth = useAuth()
    return auth.user ? <LoggedInNavBar/> : <LoggedOutNavBar/>
}

function LoggedInNavBar(){
    return (
        <nav>
            Logget inn
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
        <Container maxWidth="xl">
            <Toolbar disableGutters >
                <Box sx={{ flexGrow: 1}}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Title 
                    variant='h5' 
                    sx={{
                        display: "flex", 
                        my: 1, 
                        }}
                />
                <Box sx={{ flexGrow: 1, display: "flex"}}/>       
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

// function ProfileIcon(){
//     return (

//         <Box sx={{ flexGrow: 0 }}>
//         <Tooltip title="Open settings">
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
//                 </IconButton>
//             </Tooltip>
//             <Menu
//                 sx={{ mt: '45px' }}
//                 id="menu-appbar"
//                 anchorEl={anchorElUser}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//             >
//                 {settings.map((setting) => (
//                     <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                         <Typography textAlign="center">{setting}</Typography>
//                     </MenuItem>
//                 ))}
//             </Menu>
//         </Box> 
//     )   
// }