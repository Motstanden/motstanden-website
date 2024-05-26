import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, AppBar as MuiAppBar, Stack, SxProps, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useAppBarHeader } from 'src/context/AppBarHeader';
import { useAppBarStyle } from 'src/context/AppBarStyle';
import { usePotentialUser } from 'src/context/Authentication';
import UserAvatar from 'src/layout/AppBar/UserAvatar';
import { useAppBarHeight, useAppBarIconSize } from '../useAppSizes';
import { LoginButton } from './LoginButton';
import { SettingsButton } from './SettingsButton';

export function AppBar({ 
    onNavMenuClick, 
    onSettingsMenuClick,
    sx,
    position = "fixed"
}: { 
    onNavMenuClick?: VoidFunction,
    onSettingsMenuClick?: VoidFunction,
    sx?: SxProps,
    position?: "fixed" | "absolute" | "relative" | "static" | "sticky" 
}) {
    const { isLoggedIn } = usePotentialUser()

    const { appBarShadow } = useAppBarStyle()
    
    const appBarHeight = useAppBarHeight()
    const { buttonSize, iconFontSize} = useAppBarIconSize()

    return (
        <MuiAppBar 
            position={position} 
            sx={{
                boxShadow: appBarShadow,
                ...sx,
            }}>
            <Toolbar sx={{
                bgcolor: "primary.main",
                minHeight: appBarHeight,
                height: appBarHeight,
                justifyContent: "space-between",
            }}>
                <Stack direction="row" alignItems="center">
                    <IconButton
                        onClick={onNavMenuClick}
                        sx={{ 
                            display: { sm: 'none' },
                            height: buttonSize,
                            width: buttonSize,
                            marginRight: "2px"
                        }}
                        >
                        <MenuIcon sx={{ color: "primary.contrastText" }} fontSize={iconFontSize} />
                    </IconButton>
                    <HeaderTitle sx={{
                        ml: {xs: "3px", sm: "-9px"},
                    }}
                    />
                </Stack>
                
                <Stack 
                    direction="row"
                    alignItems="center"
                    color="primary.contrastText"
                    style={{ height: "100%" }}
                    gap={{xs: "8px", sm: "10px"}}
                >
                    <SettingsButton onClick={onSettingsMenuClick}/>
                    {!isLoggedIn && <LoginButton/>}
                    {isLoggedIn && <UserAvatar/> }
                </Stack>

            </Toolbar>
        </MuiAppBar>
    );
}

function HeaderTitle( {sx}: {sx?: SxProps}) {
    const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const headerText = useAppBarHeader()
    return (
        <Typography
            noWrap
            variant={isMobileScreen ? "inherit" : "h5"}
            sx={{
                fontWeight: 700,
                marginLeft: "3px",
                color: 'inherit',
                textDecoration: 'none',
                textTransform: "capitalize",
                ...sx,
            }}
        >
            {headerText}
        </Typography>
    )
}