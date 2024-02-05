import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { IconButton, Stack, SwipeableDrawer, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import { ThemeName, useAppTheme } from "src/context/Themes";
import { DrawerProps } from "../SideDrawer/SideDrawer";
import { useAppBarHeight, useAppBarIconSize } from '../useAppSizes';

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
            height: `${appBarHeight - 1}px`,
            minHeight: 0,
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

function ThemeSelector() {
    const { theme, name, setMode } = useAppTheme()
    const borderRadius = 12

    const onChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const value = e.currentTarget.getAttribute("value") as ThemeName
        setMode(value)
    }

    return (
        <ToggleButtonGroup
            color="secondary"
            value={name}
            exclusive
            fullWidth
            size='small'
            onChange={onChange}
            // onChange={handleChange}
            aria-label="Platform"
            sx={{
                ".MuiToggleButtonGroup-grouped": {
                    display: "flex",
                    gap: "5px",
                    textTransform: "capitalize",
                    fontWeight: 550,
                    fontSize: "9pt",
                    // color: `${theme.palette.text.secondary}f5`,
                },
                ".Mui-selected": {
                    // color: theme.palette.text.primary + " !important",
                    // borderColor: theme.palette.secondary.dark,
                },
                ".MuiToggleButtonGroup-firstButton": {
                    borderTopLeftRadius: `${borderRadius}px`,
                    borderBottomLeftRadius: `${borderRadius}px`,
                },
                ".MuiToggleButtonGroup-lastButton": {
                    borderTopRightRadius: `${borderRadius}px`,
                    borderBottomRightRadius: `${borderRadius}px`,
                }
            }}
        >
            <ToggleButton value={ThemeName.Light} >
                <LightModeIcon/>
                Dag
            </ToggleButton>
            <ToggleButton value="system">
                <SettingsBrightnessIcon/>
                System
            </ToggleButton>
            <ToggleButton value={ThemeName.Dark}>
                <DarkModeIcon/>
                Natt
            </ToggleButton>
      </ToggleButtonGroup>
    )
}