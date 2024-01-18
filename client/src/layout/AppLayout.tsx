import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Divider, IconButton, Link, Stack, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import MotstandenImg from "src/assets/logos/motstanden.png";
import { useAuth } from "src/context/Authentication";
import { FooterContent } from "src/layout/Footer";
import { SideDrawer } from 'src/layout/SideDrawer/SideDrawer';
import { ThemeSwitchButton } from 'src/layout/ThemeSwitchButton';
import UserAvatar from 'src/layout/UserAvatar';

const largeDrawerWidth = 290
const mediumDrawerWidth = 220
const smallDrawerWidth = 240    // Mobile drawer width
const desktopAppBarHeight = 70;
const mobileAppBarHeight = 57;


export function AppLayout() {

    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    let drawerWidth = largeDrawerWidth
    if(isSmallScreen) {
        drawerWidth = smallDrawerWidth
    } else if(isMediumScreen) {
        drawerWidth = mediumDrawerWidth
    }

    const [isOpen, setIsOpen] = useState(false)

    const closeDrawer = () => setIsOpen(false)
    const openDrawer = () => setIsOpen(true)
    const toggleDrawer = () => setIsOpen(prevValue => !prevValue)

    const appBarHeight = isSmallScreen ? mobileAppBarHeight : desktopAppBarHeight

    return (
        <div style={{display: "flex"}}>
            <AppBar
                position={isSmallScreen ? "fixed" : "absolute"}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    height: `${appBarHeight}px`,
                }}>
                <AppBarContent onMenuClick={toggleDrawer}/>
            </AppBar>
            <Box component="nav" 
                sx={{ 
                    flexShrink: { sm: 0 },
                    display: { xs: 'none', sm: 'flex' },
                    width: { sm: `${drawerWidth}px` },
                }}>
                <SideDrawer
                    open={isOpen}
                    onClose={closeDrawer}
                    onOpen={openDrawer}
                    drawerWidth={drawerWidth} 
                    headerHeight={appBarHeight}
                />
            </Box>
            <Box sx={{ 
                flexGrow: 1, 
                pt: `${appBarHeight}px`,  
                width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >   
                <main style={{ minHeight: `calc(100vh - ${appBarHeight}px)` }}>
                    <Outlet/>
                </main>
                <footer>
                    <FooterContent/>
                </footer>
            </Box>
        </div>
    )
}

function AppBarContent( {onMenuClick}: {onMenuClick?: VoidFunction}) {

    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery("(max-width: 663px)");
    const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

    return (
        <Toolbar sx={{
            bgcolor: "primary.main",
            height: "100%",
            justifyContent: "space-between",
        }}>
            <IconButton 
                sx={{display: { sm: 'none' },}}
                onClick={onMenuClick}>
                <MenuIcon sx={{ color: "primary.contrastText" }}  />
            </IconButton>
            <Stack 
                direction="row" 
                alignItems="center" 
                gap="15px"
            >
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{ display: isSmallScreen ? "none" : "flex" }}>
                    <img 
                        src={MotstandenImg} 
                        style={{ height: "57px"}} 
                        loading="lazy" />
                </Box>
                <Typography
                    component={RouterLink}
                    to="/"
                    noWrap
                    variant={isMobileScreen ? "inherit" : "h5"}
                    sx={{
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {isMediumScreen ? "MOTSTANDEN" : "Den Ohmske Motstanden"}
                </Typography>
            </Stack>
            <Stack 
                direction="row" 
                alignItems="center" 
                color="primary.contrastText"
                style={{height: "100%"}}
                >
                <ThemeSwitchButton 
                    fontSize='large'
                    sx={{
                        width: "42px", 
                        height: "42px", 
                        display: {xs: "none", sm: "flex"},
                        color: "inherit"
                    }}
                />
                <Divider 
                    light={true}
                    orientation='vertical'  
                    flexItem variant='middle'
                    color="inherit"
                    sx={{
                        mx: 0.5,
                        height: "50%",
                        my: "auto",
                        bgcolor: "primary.contrastText",
                        opacity: 0.3,
                        display: {xs: "none", sm: "flex"}
                    }}
                    />
                <UserInfo/>
            </Stack>
        </Toolbar>
    )
}

function UserInfo() {
    const auth = useAuth()

    if(auth.user)
        return <UserAvatar/>

    return (
        <Link
            component={RouterLink}
            to="/logg-inn"
            underline="hover"
            sx={{
                color: "inherit",
                pl: 1,
                fontWeight: 600
            }}
        >
            LOGG INN
        </Link>
    )
}