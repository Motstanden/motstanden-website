import { Divider, Tab, Tabs, TabsProps, Theme, useMediaQuery } from "@mui/material";
import { Link as RouterLink, matchPath, resolvePath, useLocation } from "react-router-dom";

export function PageTab( {items, tabProps, matchChildPath}: {items: PageTabItem[], tabProps?: TabsProps, matchChildPath?: boolean }){

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Find the item that matches the current url.
    //  - Logic retrieved from NavLink at https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx
    const location = useLocation()
    const currentValue = items.find( item => {
        
        const path = resolvePath(item.to)
        const locationPathname = location.pathname.toLowerCase()
        const toPathname = path.pathname.toLowerCase()

        const isExact = locationPathname === toPathname
        const isChild = matchChildPath && (locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/") 
        
        return isExact || isChild

    }) ?? items[0]

    return (
        <div>
            <Tabs 
                value={currentValue.label} 
                textColor="secondary"
                indicatorColor="secondary"
                variant={isSmallScreen ? "fullWidth" : "standard"}
                scrollButtons="auto"
                {...tabProps}
                >
                {items.map(item => (
                    <Tab
                        key={item.label}
                        component={RouterLink}
                        to={item.to}
                        value={item.label}
                        label={item.label}
                        wrapped
                    />)
                    )}
            </Tabs>
            <Divider/>
        </div>
    )
}

export interface PageTabItem {
    to: string, 
    label: string
}