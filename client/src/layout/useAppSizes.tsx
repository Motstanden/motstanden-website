import { useMediaQuery } from "@mui/material";
import { useAppTheme } from "src/context/AppTheme";

const largeDesktopDrawerWidth = 335
const mediumDesktopDrawerWidth = 270
const smallDesktopDrawerWidth = 230
const mobileDrawerWidth = 240  

const settingsDrawerWidth = 270

const desktopAppBarHeight = 64;
const mobileAppBarHeight = 54;

const mobileAppBarIconSize = 33
const desktopAppBarIconSize = 38

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

// This may be responsive in the future
export function useAppBarIconSize(): {
    buttonSize: number,
    iconFontSize?: "small" | "inherit" | "medium" | "large" 
} {
    const isMobile = useIsMobileScreen()    

    if(isMobile)
        return { buttonSize: mobileAppBarIconSize, iconFontSize: "medium" }

    return { buttonSize: desktopAppBarIconSize, iconFontSize: "medium" }
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

    return {
        drawerWidth: drawerWidth,
        settingsDrawerWidth: settingsDrawerWidth,
    }
}

interface AppSizesProps {
    drawerWidth: number,
    settingsDrawerWidth: number,
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
        ...drawerWidth,
        appBarHeight: appBarHeight,
        tabBarHeight: tabBarHeight,
        isMobileScreen: isMobileScreen,
    }

    return appSizes
}

