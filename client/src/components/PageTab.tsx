
import {
    Divider,
    Tab,
    Tabs,
    TabsProps,
    Theme,
    useMediaQuery
} from "@mui/material";
import React from "react";
import { Link as RouterLink, Location as RouterLocation, matchPath, useLocation } from "react-router-dom";

export function PageTab({ 
    items, 
    tabProps, 
    matchChildPath,
    style,
    onTabClick,
}: { 
    items: PageTabItem[], 
    tabProps?: TabsProps, 
    matchChildPath?: boolean,
    style?: React.CSSProperties
    onTabClick?: () => void
}) {

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const location = useLocation()
    const currentValue = findActiveTab(items, location, {matchChildPath: matchChildPath}) ?? items[0]

    return (
        <div style={style}>
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
                        onClick={onTabClick}
                    />)
                )}
            </Tabs>
            <Divider />
        </div>
    )
}

export function findActiveTab(
    tabs: PageTabItem[], 
    location: RouterLocation,
    options?: {
        matchChildPath?: boolean
    }
): PageTabItem | undefined {
    for(let i = 0; i < tabs.length; i++) {
        const item = tabs[i]
        const pattern = options?.matchChildPath ? item.to + "/*" : item.to
        const isMatch = !!matchPath(pattern, location.pathname)
        if(isMatch) {
            return item
        }
    }
    return undefined;
}

export interface PageTabItem {
    to: string,
    label: string
}