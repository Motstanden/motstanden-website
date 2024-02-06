import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, SwipeableDrawer, Toolbar, Typography } from "@mui/material";
import { DrawerProps } from "../NavDrawer/NavDrawer";
import { useAppBarHeight, useAppBarIconSize } from '../useAppSizes';
import { ThemeSelector } from './ThemeSelector';
import { TimeZoneSelector } from './TimeZoneSelector';

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
            <DrawerContent onClose={onClose}/> 
        </SwipeableDrawer>
    )
}

function DrawerContent( { onClose }: { onClose: VoidFunction }) {
    return (
        <div style={{
            paddingInline: "17px"
        }}>
            <Header onClose={onClose} />
            
            <SectionTitle title="Modus" style={{marginTop: "5px"}} />
            <ThemeSelector/>

            <SectionTitle title="Tidssone" />
            <TimeZoneSelector/>
        </div>
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
        <Toolbar 
            disableGutters  
            sx={{
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
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        color: theme => theme.palette.text.secondary,
                        opacity: 0.95,
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

function SectionTitle( { title, style, }: { title: string, style?: React.CSSProperties }) {
    return (
        <h6 
            style={{
                opacity: 0.6, 
                marginTop: "25px",
                marginBottom: "5px",
                marginLeft: "1px",
                textTransform: "uppercase",
                ...style
        }}>
            {title}
        </h6>
    )
}