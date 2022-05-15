import React, { useState } from 'react';

// Material UI
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { VariantType } from '../tsTypes/MaterialUiTypes';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contextProviders/Authentication';

import NavBar from "./appBar/NavBar"
import SideDrawer from './appBar/SideDrawer';
import ThemeSwitcher from './appBar/ThemeSwitcher';

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
        <Container>

            <Toolbar disableGutters>
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="space-between" 
                    sx={{width: "100%"}}
                    >
                    <Stack 
                        direction="row"
                        alignItems="center"
                        spacing={6}>
                        <Title variant='h5'/>
                        <NavBar/>
                    </Stack>
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        sx={{justifySelf: "flex-end"}} >
                        <ThemeSwitcher/>
                        <Divider 
                            light={false} 
                            orientation="vertical" 
                            flexItem
                            variant="middle"
                            sx={{
                                mr: 1,
                                ml: 2,
                                my: 1
                            }}
                            />
                        <LoginStatus/>  
                    </Stack>
                </Stack>
            </Toolbar>
        </Container>
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

interface TitleProps {
    variant: VariantType,
    sx?: SxProps | undefined
}

function Title(props: TitleProps) {
    let auth = useAuth()
	return (
        <Typography
            component={RouterLink}
            to={auth.user ? "/hjem" : "/"}
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

function LoginStatus(){
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
        <Tooltip title={username}>
            <IconButton onClick={handleClick}>
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
            component={RouterLink} to="/logg-inn" 
            sx={{
                color: "inherit",
                fontWeight: 300,
                ml: 1
            }}
        >
            Logg inn
        </Link>
    )
}