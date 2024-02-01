import { useMediaQuery } from "@mui/material";
import { useAppTheme } from "src/context/Themes";

const largeDesktopDrawerWidth = 335
const mediumDesktopDrawerWidth = 270
const smallDesktopDrawerWidth = 230
const mobileDrawerWidth = 240  

const desktopAppBarHeight = 64;
const mobileAppBarHeight = 57;

const tabBarHeight = 48

export function useIsMobileScreen() {
    const { theme } = useAppTheme()
    const isMobile = useMediaQuery(theme.breakpoints.only('xs'))
    return isMobile
}

export function useAppBarHeight() { 
    const isMobile = useIsMobileScreen()    
    return isMobile ? mobileAppBarHeight : desktopAppBarHeight
}

// This may be responsive in the future
export function useTabBarHeight() {
    return tabBarHeight
}

export function useDrawerWidth() {
    const {theme} = useAppTheme()
    const isSmall = useMediaQuery(theme.breakpoints.only('sm'))
    const isMedium = useMediaQuery(theme.breakpoints.only("md"))
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"))

    let drawerWidth = mobileDrawerWidth
    if(isSmall) {
        drawerWidth = smallDesktopDrawerWidth
    } else if(isMedium) {
        drawerWidth = mediumDesktopDrawerWidth
    } else if (isLarge) {
        drawerWidth = largeDesktopDrawerWidth
    }

    return drawerWidth
}

interface AppSizesProps {
    drawerWidth: number,
    appBarHeight: number,
    tabBarHeight: number,
    isMobileScreen: boolean,
}

export function useAppSizes(): AppSizesProps {
    const isMobileScreen = useIsMobileScreen()
    const drawerWidth = useDrawerWidth()
    const appBarHeight = useAppBarHeight()
    const tabBarHeight = useTabBarHeight()

    const appSizes: AppSizesProps = {
        drawerWidth: drawerWidth,
        appBarHeight: appBarHeight,
        tabBarHeight: tabBarHeight,
        isMobileScreen: isMobileScreen,
    }

    return appSizes
}

