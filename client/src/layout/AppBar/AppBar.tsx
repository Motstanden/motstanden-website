import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, IconButton, Link, AppBar as MuiAppBar, Stack, SxProps, Theme, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MotstandenImg from "src/assets/logos/motstanden.png";
import { useAuth } from 'src/context/Authentication';
import UserAvatar from 'src/layout/AppBar/UserAvatar';
import { ThemeSwitchButton } from 'src/layout/ThemeSwitchButton';

export function AppBar({ 
    onMenuClick, 
    sx,
    position = "fixed"
}: { 
    onMenuClick?: VoidFunction,
    sx?: SxProps,
    position?: "fixed" | "absolute" | "relative" | "static" | "sticky" 
}) {

    const isLoggedIn = useAuth().user != null

    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery("(max-width: 663px)");
    const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <MuiAppBar position={position} sx={sx}>
            <Toolbar sx={{
                bgcolor: "primary.main",
                height: "100%",
                justifyContent: "space-between",
            }}>
                <IconButton
                    sx={{ display: { sm: 'none' }, }}
                    onClick={onMenuClick}>
                    <MenuIcon sx={{ color: "primary.contrastText" }} />
                </IconButton>

                <Stack
                    direction="row"
                    alignItems="center"
                    gap="15px"
                >
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{ display: isSmallScreen ? "none" : "flex" }}>
                        <img
                            src={MotstandenImg}
                            style={{ height: "57px" }}
                            loading="lazy" />
                    </Box>
                    <Typography
                        component={RouterLink}
                        to="/"
                        noWrap
                        variant={isMobileScreen ? "inherit" : "h5"}
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {isMediumScreen ? "MOTSTANDEN" : "Den Ohmske Motstanden"}
                    </Typography>
                </Stack>
                
                <Stack
                    direction="row"
                    alignItems="center"
                    color="primary.contrastText"
                    style={{ height: "100%" }}
                >
                    <ThemeSwitchButton
                        fontSize={isLoggedIn ? "large" : "medium"}
                        sx={{
                            width: isLoggedIn ? "42px" : "35px",
                            height: isLoggedIn ? "42px" : "35px",
                            display: { xs: "none", sm: "flex" },
                            color: "inherit"
                        }} />
                    <Divider
                        light={true}
                        orientation='vertical'
                        flexItem variant='middle'
                        color="inherit"
                        sx={{
                            mx: 0.5,
                            height: isLoggedIn ? "50%" : "35%",
                            my: "auto",
                            bgcolor: "primary.contrastText",
                            opacity: 0.3,
                            display: { xs: "none", sm: "flex" }
                        }} />
                    <UserInfo />
                </Stack>

            </Toolbar>
        </MuiAppBar>
    );
}

function UserInfo() {
    const auth = useAuth()

    if(auth.user)
        return <UserAvatar/>

    return (
        <Link
            component={RouterLink}
            to="/logg-inn"
            underline="hover"
            sx={{
                color: "inherit",
                pl: 1,
                fontWeight: 600
            }}
        >
            LOGG INN
        </Link>
    )
}