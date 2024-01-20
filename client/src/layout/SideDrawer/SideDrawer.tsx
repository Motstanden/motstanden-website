import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, SwipeableDrawer, SxProps, Toolbar } from "@mui/material";
import { useAppTheme } from 'src/context/Themes';
import { ThemeSwitchButton } from 'src/layout/ThemeSwitchButton';
import { NavContent } from './NavContent';

export function SideDrawer( {
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
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
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
                }}/>
            <NavContent onItemClick={onClose}/>
        </>
    )   
}

function MobileHeader({ onClose, sx }: {onClose?: VoidFunction, sx?: SxProps}) {
    const { theme } = useAppTheme()

    return (
        <Toolbar sx={{
            alignItems: "center", 
            justifyContent: "space-between", 
            paddingLeft: "25px",
            paddingRight: "25px",
            mb: "-13px",
            ...sx
        }}>
            <ThemeSwitchButton 
                fontSize='medium' 
                sx={{
                    borderColor: `${theme.palette.action.hover}`,
                    borderStyle: "solid", 
                    borderWidth: "1px"
                }}
            />
            <IconButton 
                onClick={onClose}
                sx={{
                    borderColor: `${theme.palette.action.hover}`,
                    borderStyle: "solid", 
                    borderWidth: "1px"
                }}>
                <CloseIcon />
            </IconButton>
        </Toolbar>
    )
}