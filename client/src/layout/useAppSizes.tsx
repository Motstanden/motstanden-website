import { Theme, useMediaQuery } from "@mui/material";

const desktopDrawerWidth = 290
const smallDesktopDrawerWidth = 220
const mobileDrawerWidth = 240    // Mobile drawer width

const desktopAppBarHeight = 70;
const mobileAppBarHeight = 57;

interface AppSizesProps {
    drawerWidth: number,
    appBarHeight: number,
    isMobileScreen: boolean,
}

export function useAppSizes(): AppSizesProps {
    const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'))
    const isSmallDesktopScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'))

    let drawerWidth = desktopDrawerWidth
    if(isMobileScreen) {
        drawerWidth = mobileDrawerWidth
    } else if(isSmallDesktopScreen) {
        drawerWidth = smallDesktopDrawerWidth
    }

    const appBarHeight = isMobileScreen ? mobileAppBarHeight : desktopAppBarHeight

    const appSizes: AppSizesProps = {
        drawerWidth: drawerWidth,
        appBarHeight: appBarHeight,
        isMobileScreen: isMobileScreen,
    }

    return appSizes
}

