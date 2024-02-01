import { Divider, Tab, Tabs, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { Link as RouterLink, Location as RouterLocation, matchPath, useLocation } from "react-router-dom";
import { useAppBarStyle } from "src/context/AppBarStyle";
import { useAppTheme } from "src/context/Themes";
import { PageContainer } from "./PageContainer";


export const tabBarHeight = 48

export function TabbedPageContainer({
    children, tabItems, matchChildPath
}: {
    children: React.ReactNode;
    tabItems: PageTabItem[];
    matchChildPath?: boolean;
}) {
    const { theme } = useAppTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

    const { setHasFixedTabBar, hasFixedTabBar, tabBarShadow } = useAppBarStyle();

    // We need to notify the AppBarStyleContext that we have a fixed tab bar.
    // The tab bar should be fixed on desktop, but not on mobile.
    useEffect(() => {
        setHasFixedTabBar(!isMobile);
        return () => setHasFixedTabBar(false)
    }, []);

    useEffect(() => {
        setHasFixedTabBar(!isMobile);
    }, [isMobile]);

    // Select current tab based on url
    const location = useLocation()
    const currentTab = findActiveTab(tabItems, location, {matchChildPath: matchChildPath}) ?? tabItems[0]

    return (
        <>
            <div style={ hasFixedTabBar ? {
                    position: "fixed",
                    width: "100%",
                    zIndex: 1000,
                } : undefined}>
                <Tabs
                    value={currentTab.label}
                    textColor="secondary"
                    indicatorColor="secondary"
                    variant={isMobile ? "fullWidth" : "standard"}
                    scrollButtons="auto"
                    sx={{
                        height: `${tabBarHeight}px`,
                        boxShadow: tabBarShadow,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    {tabItems.map(item => (
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
            <div style={{
                paddingTop: hasFixedTabBar ? `${tabBarHeight}px` : undefined,
            }}>
                <PageContainer>
                    {children}
                </PageContainer>
            </div>
        </>
    );
}

function findActiveTab(
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

interface PageTabItem {
    to: string,
    label: string
}