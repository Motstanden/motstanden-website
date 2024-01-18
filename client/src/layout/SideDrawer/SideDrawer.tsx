import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, SwipeableDrawer, SxProps, Toolbar } from "@mui/material";
import { ThemeSwitchButton } from "../appBar/SideDrawer";
import { ListItemDivider } from './ListItem';
import { NavContent } from './NavContent';

export function SideDrawer( {
    open: mobileOpen,
    onOpen,
    onClose,
    drawerWidth,
    headerHeight,
}: {
    open: boolean,
    onOpen: VoidFunction,
    onClose: VoidFunction,
    headerHeight: number,
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
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
                }}
                >
                <DrawerContent 
                    mobileHeaderHeight={headerHeight} 
                    onClose={onClose}
                    />
            </Drawer>

            {/* Mobile drawer */}
            <SwipeableDrawer
                anchor='left'
                open={mobileOpen}
                onClose={onClose}
                onOpen={onOpen}
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
                <DrawerContent 
                    mobileHeaderHeight={headerHeight} 
                    onClose={onClose} 
                />
            </SwipeableDrawer>
        </>
    )
}

function DrawerContent({ 
    mobileHeaderHeight, 
    onClose 
}: {
    mobileHeaderHeight: number, 
    onClose: VoidFunction
}) {
    return (
        <>
            <MobileHeader 
                onClose={onClose}
                sx={{ 
                    display: { xs: "flex", sm: "none" },
                    height: `${mobileHeaderHeight - 1}px`,
                }}/>
            <ListItemDivider sx={{ display: {xs: "flex", sm: "none" }}}/>
            <NavContent onItemClick={onClose}/>
        </>
    )   
}

function MobileHeader({ onClose, sx }: {onClose?: VoidFunction, sx?: SxProps}) {
    return (
        <Toolbar sx={{
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingLeft: "25px",
            paddingRight: "25px",
            ...sx
        }}>
            <ThemeSwitchButton fontSize='medium'/>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Toolbar>
    )
}