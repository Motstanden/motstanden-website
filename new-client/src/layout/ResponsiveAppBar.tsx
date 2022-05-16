import React, { useState } from 'react';

// Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { VariantType } from '../tsTypes/MaterialUiTypes';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contextProviders/Authentication';

import { NavBar, NavLink } from "./appBar/NavBar"
import SideDrawer from './appBar/SideDrawer';
import ThemeSwitcher from './appBar/ThemeSwitcher';
import UserAvatar from "./appBar/UserAvatar"

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
    return  auth.user 
        ? <UserAvatar/> 
        : <NavLink text="Logg Inn" to="/logg-inn" sx={{fontWeight: 600}}/>
}