import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, IconButton, Stack, SwipeableDrawer, SxProps, Toolbar, Typography } from "@mui/material";
import { useAppBarHeight, useAppBarIconSize } from '../useAppSizes';
import { NavContent } from './NavContent';

export interface DrawerProps {
    open: boolean,
    onOpen: VoidFunction,
    onClose: VoidFunction,
    drawerWidth: number,
}

export function NavDrawer( {
    open: mobileOpen,
    onOpen,
    onClose,
    drawerWidth,
}: {
    open: boolean,
    onOpen: VoidFunction,
    onClose: VoidFunction,
    drawerWidth: number,
}) {
    return (
        <>
            {/* Desktop drawer */}
            <Drawer 
                open={true}             // Desktop is always open 
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth,
                        scrollbarWidth: "thin",
                        scrollbarColor: `#959595 transparent`,
                    },
                }}
                >
                <DrawerContent onClose={onClose} />
            </Drawer>

            {/* Mobile drawer */}
            <SwipeableDrawer
                anchor='left'
                open={mobileOpen}
                onClose={onClose}
                onOpen={onOpen}
                swipeAreaWidth={400}
                elevation={0}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <DrawerContent onClose={onClose}/>
            </SwipeableDrawer>
        </>
    )
}

function DrawerContent({ onClose }: { onClose: VoidFunction }) {
    return (
        <>
            <MobileHeader 
                onClose={onClose}
                sx={{ 
                    display: { xs: "flex", sm: "none" },
                    marginBottom: {xs: "-7px", sm: undefined}
                }}/>
            <NavContent onItemClick={onClose}/>
        </>
    )   
}

function MobileHeader({ 
    onClose, 
    sx 
}: {
    onClose?: VoidFunction, 
    sx?: SxProps
}) {
    const appBarHeight  = useAppBarHeight()
    const { buttonSize, iconFontSize } = useAppBarIconSize()

    return (
        <Toolbar sx={{
            alignItems: "center", 
            paddingLeft: "16px",
            minHeight: appBarHeight,
            height: appBarHeight,
            ...sx
        }}>
            <Stack 
                alignItems="center" 
                direction="row">
                <IconButton 
                    onClick={onClose}
                    sx={{
                        height: buttonSize,
                        width: buttonSize,
                        marginRight: "2px",
                    }}>
                    <MenuIcon 
                        fontSize={iconFontSize} 
                        sx={{ 
                            opacity: 0.97,
                            color: theme => theme.palette.text.secondary 
                        }} 
                    />
                </IconButton>
                <Typography
                    noWrap
                    variant='inherit'
                    sx={{
                        fontWeight: 700,
                        marginLeft: "3px",
                        opacity: 0.97,
                        color: theme => theme.palette.text.secondary,
                        textDecoration: 'none',
                    }}
                >
                    Motstanden
                </Typography>
            </Stack>
        </Toolbar>
    )
}