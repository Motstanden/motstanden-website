import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Divider, Drawer, IconButton, Stack, SwipeableDrawer, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useAuth } from "src/context/Authentication";
import MotstandenImg from "../assets/logos/motstanden.png";
import { FooterContent } from "./Footer";
import { NavLink } from './appBar/NavBar';
import { ContentPicker, ThemeSwitchButton } from "./appBar/SideDrawer";
import UserAvatar from './appBar/UserAvatar';

const largeDrawerWidth = 290
const mediumDrawerWidth = 220
const smallDrawerWidth = 230    // Mobile drawer width
const appBarHeight = 70;

export function AppLayout() {

    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    let drawerWidth = largeDrawerWidth
    if(isSmallScreen) {
        drawerWidth = smallDrawerWidth
    } else if(isMediumScreen) {
        drawerWidth = mediumDrawerWidth
    }

    const [mobileOpen, setMobileOpen] = useState(false)

    const closeDrawer = () => setMobileOpen(false)
    const openDrawer = () => setMobileOpen(true)
    const toggleDrawer = () => setMobileOpen(prevValue => !prevValue)

    return (
        <div style={{display: "flex"}}>

            {/* Bar at the top */}
            <AppBar
                position={isSmallScreen ? "fixed" : "absolute"}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    height: `${appBarHeight}px`,
                }}>
                <AppBarContent onMenuClick={toggleDrawer}/>
            </AppBar>

            {/* Side drawer */}
            <Box 
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Desktop drawer */}
                <Drawer 
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                    >
                    <DrawerContent onRequestedExit={closeDrawer}/>
                </Drawer>

                {/* Mobile drawer */}
                <SwipeableDrawer
                    anchor='left'
                    open={mobileOpen}
                    onClose={closeDrawer}
                    onOpen={openDrawer}
                    swipeAreaWidth={400}
                    disableSwipeToOpen={true}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                      }}
                >
                    <DrawerContent onRequestedExit={closeDrawer} />
                </SwipeableDrawer>
            </Box>

            {/* Rest of the page */}
            <Box sx={{ 
                flexGrow: 1, 
                pt: `${appBarHeight}px`,  
                width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >   
                
                {/* Main content */}
                <main style={{ minHeight: `calc(100vh - ${appBarHeight}px)` }}>
                    <Outlet/>
                </main>

                {/* Footer */}
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
                        style={{ height: "57px", marginTop: "3px" }} 
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
                    sx={{width: "42px", height: "42px", display: {xs: "none", sm: "flex"}}}
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
    return auth.user
        ? <UserAvatar />
        : <NavLink text="LOGG INN" to="/logg-inn" sx={{ fontWeight: 600 }} />
}

function DrawerContent( {onRequestedExit}: {onRequestedExit?: VoidFunction}) {
    return (
        <>
            {/* Put something here? */}

            {/* <Toolbar style={{justifyContent: "space-between", height: `${appBarHeight - 1}px`}}>
                <HeaderLogo/>
                <UserInfo/>
                <ThemeSwitcher/>
            </Toolbar>
            <Divider/> */}
            
            <DrawerNavigation onRequestedExit={onRequestedExit}/>
        </>
    )
}

function DrawerNavigation({onRequestedExit}: {onRequestedExit?: VoidFunction}) {
    const auth = useAuth()
    return auth.user
        ? <PrivateDrawerNavigation onRequestedExit={onRequestedExit} />
        : <PublicDrawerNavigation onRequestedExit={onRequestedExit} />
}

function PublicDrawerNavigation( {onRequestedExit}: {onRequestedExit?: VoidFunction} ) {
    // Temporary
    return (
        <ContentPicker onRequestedExit={onRequestedExit} />
    )
}

function PrivateDrawerNavigation( {onRequestedExit}: {onRequestedExit?: VoidFunction}) {
    // Temporary
    return (
        <ContentPicker onRequestedExit={onRequestedExit}/>    
    )
}