import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, SwipeableDrawer, Toolbar, Typography } from "@mui/material";
import { DrawerProps } from "../SideDrawer/SideDrawer";
import { useAppBarHeight, useAppBarIconSize } from '../useAppSizes';
import { ThemeSelector } from './ThemeSelector';

export function SettingsDrawer( {
    open,
    onOpen,
    onClose,
    drawerWidth,
}: DrawerProps) {
    return (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            swipeAreaWidth={400}
            disableSwipeToOpen={true}
            elevation={0}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: drawerWidth,
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                },
            }}
        >
            <Header onClose={onClose} />
            <Content />   
        </SwipeableDrawer>
    )
}

function Header( {
    onClose,
}: {
    onClose: VoidFunction
}) {
    const { buttonSize, iconFontSize } = useAppBarIconSize()
    const appBarHeight  = useAppBarHeight()
    return (
        <Toolbar sx={{
            alignItems: "center",
            minHeight: appBarHeight,
            height: appBarHeight,
            display: "flex",
        }}>
            <Stack 
                direction="row" 
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                >
                <Typography
                    noWrap
                    variant="inherit"
                    sx={{
                        fontWeight: 700,
                        marginLeft: "2px",
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                    >
                    Innstillinger
                </Typography>
                <IconButton 
                    onClick={onClose}
                    sx={{
                        width: buttonSize,
                        height: buttonSize,
                    }}
                    >
                    <CloseIcon fontSize={iconFontSize} />
                </IconButton>
            </Stack>
        </Toolbar>
    )
}

function Content() {
    return (
        <div style={{
            margin: "0px",
            paddingInline: "18px",
        }}>
            <ThemeSection/>
        </div>
    )
}

function ThemeSection() {
    return (
        <>
            <h6 
                style={{
                    opacity: 0.6, 
                    marginTop: "5px",
                    marginBottom: "5px",
                    marginLeft: "1px"
            }}>
                MODUS
            </h6>
            <ThemeSelector/>
        </>
    )
}

