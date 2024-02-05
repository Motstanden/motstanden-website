import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FooterContent } from "src/layout/Footer";
import { SideDrawer } from 'src/layout/SideDrawer/SideDrawer';
import { AppBar } from "./AppBar/AppBar";
import { SettingsDrawer } from "./SettingsDrawer/SettingsDrawer";
import { useAppBarHeight, useAppSizes, useDrawerWidth } from "./useAppSizes";

export function AppLayout() {

    const { drawerWidth, settingsDrawerWidth } = useDrawerWidth()
    const appBarHeight = useAppBarHeight()
    
    const navDrawer = useDrawer()
    const settingsDrawer = useDrawer()

    return (
        <div style={{display: "flex"}}>
            
            <header>
                <AppBar 
                    onNavMenuClick={navDrawer.toggle}
                    onSettingsMenuClick={settingsDrawer.toggle}
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
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
                    open={navDrawer.isOpen}
                    onClose={navDrawer.close}
                    onOpen={navDrawer.open}
                    drawerWidth={drawerWidth} 
                />
            </Box>

            <SettingsDrawer 
                open={settingsDrawer.isOpen}
                onClose={settingsDrawer.close}
                onOpen={settingsDrawer.open}
                drawerWidth={settingsDrawerWidth}
            />

            <Box sx={{ 
                flexGrow: 1, 
                pt: `${appBarHeight}px`,  
                width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` } }}
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

function useDrawer() {
    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)
    const toggle = () => setIsOpen(prevValue => !prevValue)

    return { isOpen, open, close, toggle }
}