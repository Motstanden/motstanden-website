import { Divider, Tab, Tabs, TabsProps, Theme, useMediaQuery } from "@mui/material";
import { Link as RouterLink, matchPath, useLocation } from "react-router-dom";
import { matchUrl } from "../utils/matchUrl";

export function PageTab( {items, tabProps, matchChildPath}: {items: PageTabItem[], tabProps?: TabsProps, matchChildPath?: boolean }){

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Find the item that matches the current url.
    //  - Logic retrieved from NavLink at https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx
    const location = useLocation()
    const currentValue = items.find( item => matchUrl(item.to, location, {matchChildPath: matchChildPath})) ?? items[0]

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