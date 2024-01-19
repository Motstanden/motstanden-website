import { Box, Theme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FooterContent } from "src/layout/Footer";
import { SideDrawer } from 'src/layout/SideDrawer/SideDrawer';
import { AppBar } from "./AppBar/AppBar";
import { useAppSizes } from "./useAppSizes";

export function AppLayout() {

    const { appBarHeight, drawerWidth, isMobileScreen } = useAppSizes()
    const [isOpen, setIsOpen] = useState(false)

    const closeDrawer = () => setIsOpen(false)
    const openDrawer = () => setIsOpen(true)
    const toggleDrawer = () => setIsOpen(prevValue => !prevValue)

    return (
        <div style={{display: "flex"}}>
            
            <header>
                <AppBar 
                    onMenuClick={toggleDrawer}
                    position={isMobileScreen ? "fixed" : "absolute"}
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