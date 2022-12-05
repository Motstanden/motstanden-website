
// Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';
import { VariantType } from '../../utils/tsTypes/MaterialUiTypes';

import { NavBar, NavLink } from "./NavBar";
import SideDrawer from './SideDrawer';
import ThemeSwitcher from './ThemeSwitcher';
import UserAvatar from "./UserAvatar";

import MotstandenImg from "../../assets/logos/motstanden.png";

export default function ResponsiveAppBar() {
    return (
        <AppBar position="static">
            <Toolbar sx={{ bgcolor: "primary.main" }} >
                <DesktopToolbar display={{ xs: "none", md: "flex" }} />
                <MobileToolBar display={{ xs: "flex", md: "none" }} />
            </Toolbar>
        </AppBar>
    )
}

type DisplayProp = { xs: string, md: string}

function DesktopToolbar({ display }: { display: DisplayProp}) { // TODO: Find the correct type for display
    return (
        <Stack
            display={display}
            direction="row"
            alignItems="center"
            justifyContent="center"
            px={{ lg: 0, xl: 2 }}
            sx={{ width: "100%" }}
        >
            <div style={{ marginRight: "auto", flex: 1 }}>
                <HeaderTitle variant='h5' />
            </div>
            <NavBar />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{
                    width: "max(135px)",
                    marginLeft: "auto",
                    flex: 1

                }}
            >
                <ThemeSwitcher />
                <Divider
                    light={false}
                    orientation="vertical"
                    flexItem
                    variant="middle"
                    sx={{
                        mr: 1,
                        ml: 2,
                        my: 1
                    }}
                />
                <UserInfo />
            </Stack>
        </Stack>
    )
}

function MobileToolBar({ display }: { display: DisplayProp }) {
    return (
        <Stack
            display={display}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
        >
            <SideDrawer />
            <HeaderTitle variant='h6' sx={{ pl: 2 }} />
            <UserInfo />
        </Stack>
    )
}


function HeaderTitle({ variant, sx }: { variant?: VariantType, sx?: SxProps }) {
    const auth = useAuth()
    const isLoggedIn = auth.user ? true : false // It is a tight fit on the navbar if the user is logged in
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ pr: 4 }}
            display={isLoggedIn
                ? { xs: "flex", md: "none", lg: "flex" }
                : { xs: "flex" }
            }>
            <Box
                display={isLoggedIn
                    ? { xs: "none", lg: "inline" }
                    : { xs: "none", md: "inline" }}
            >
                <RouterLink to={isLoggedIn ? "/hjem" : "/"} >
                    <img src={MotstandenImg} style={{ height: "45px", marginTop: "3px" }} loading="lazy" />
                </RouterLink>
            </Box>

            <Box display={isLoggedIn ? { md: "none", lg: "none", xl: "inline" } : {}}>
                <Typography
                    component={RouterLink}
                    to={isLoggedIn ? "/hjem" : "/"}
                    noWrap
                    variant={variant}
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        ...sx
                    }}
                >

                    MOTSTANDEN
                </Typography>
            </Box>
        </Stack>
    )
}

function UserInfo() {
    const auth = useAuth()
    return auth.user
        ? <UserAvatar />
        : <NavLink text="Logg Inn" to="/logg-inn" sx={{ fontWeight: 600 }} />
}