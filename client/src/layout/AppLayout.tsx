import { Box, Theme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FooterContent } from "src/layout/Footer";
import { SideDrawer } from 'src/layout/SideDrawer/SideDrawer';
import { AppBar } from "./AppBar/AppBar";

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
            
            <header>
                <AppBar 
                    onMenuClick={toggleDrawer}
                    position={isSmallScreen ? "fixed" : "absolute"}
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        height: `${appBarHeight}px`,
                    }}
                />
            </header>

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