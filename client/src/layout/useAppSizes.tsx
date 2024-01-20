import { useMediaQuery } from "@mui/material";
import { useAppTheme } from "src/context/Themes";

const largeDesktopDrawerWidth = 335
const mediumDesktopDrawerWidth = 270
const smallDesktopDrawerWidth = 230
const mobileDrawerWidth = 240  

const desktopAppBarHeight = 70;
const mobileAppBarHeight = 57;

interface AppSizesProps {
    drawerWidth: number,
    appBarHeight: number,
    isMobileScreen: boolean,
}

export function useAppSizes(): AppSizesProps {
    const {theme} = useAppTheme()
    const isTiny = useMediaQuery(theme.breakpoints.only('xs'))
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

    const appBarHeight = isTiny ? mobileAppBarHeight : desktopAppBarHeight

    const appSizes: AppSizesProps = {
        drawerWidth: drawerWidth,
        appBarHeight: appBarHeight,
        isMobileScreen: isTiny,
    }

    return appSizes
}

