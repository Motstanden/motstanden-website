import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, AppBar as MuiAppBar, Stack, SxProps, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MotstandenImg from "src/assets/logos/motstanden.png";
import { useAppBarStyle } from 'src/context/AppBarStyle';
import { usePotentialUser } from 'src/context/Authentication';
import UserAvatar from 'src/layout/AppBar/UserAvatar';
import { useAppBarIconSize } from '../useAppSizes';
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
    
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
                height: "100%",
                justifyContent: "space-between",
            }}>
                <Stack direction="row" alignItems="center">
                    <IconButton
                        onClick={onNavMenuClick}
                        sx={{ 
                            display: { sm: 'none' },
                            height: buttonSize,
                            width: buttonSize,
                        }}
                        >
                            <MenuIcon sx={{ color: "primary.contrastText" }} fontSize={iconFontSize} />
                    </IconButton>
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{ 
                            display: {xs: "none", sm: "flex"}, 
                            marginRight: "8px"
                        }}>
                        <img
                            src={MotstandenImg}
                            style={{ height: "48px" }}
                            loading="lazy" />
                    </Box>
                    <Typography
                        component={RouterLink}
                        to="/"
                        noWrap
                        variant={isMobileScreen ? "inherit" : "h5"}
                        sx={{
                            fontWeight: 700,
                            marginLeft: "3px",
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {isMediumScreen ? "Motstanden" : "Den Ohmske Motstanden"}
                    </Typography>
                </Stack>
                
                <Stack 
                    direction="row"
                    alignItems="center"
                    color="primary.contrastText"
                    style={{ height: "100%" }}
                    gap={{xs: "5px", sm: "10px"}}
                >
                    <SettingsButton onClick={onSettingsMenuClick}/>
                    {!isLoggedIn && <LoginButton/>}
                    {isLoggedIn && <UserAvatar/> }
                </Stack>

            </Toolbar>
        </MuiAppBar>
    );
}

function LoginButton() {
    const { buttonSize, iconFontSize } = useAppBarIconSize()
    return (
        <IconButton
            component={RouterLink}
            to="/logg-inn"
            sx={{
                width: buttonSize,
                height: buttonSize,
                p: "0px",
                color: "inherit",
                bgcolor: "#FFFFFF15",
                ":hover": {
                    bgcolor: "#FFFFFF30",
                }
            }}
        >
            <LoginIcon 
                fontSize={iconFontSize}
                sx={{
                    marginRight: "2px"
                }}
            />
        </IconButton>
    )
}