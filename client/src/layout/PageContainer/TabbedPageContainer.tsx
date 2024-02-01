import { useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { PageTab, PageTabItem } from "src/components/PageTab";
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

    const appBar = useAppBarStyle();

    // If this component exists, the shadow should be on the tab bar instead of the app bar.
    useEffect(() => {
        appBar.removeAppBarShadow();
        return () => appBar.addAppBarShadow();
    }, []);

    // If the screen is mobile, then the app bar should have a shadow because the tab bar is not fixed to the top
    useEffect(() => {
        if (isMobile) {
            appBar.addAppBarShadow();
        } else {
            appBar.removeAppBarShadow();
        }
    }, [isMobile]);

    const tabPositionStyle: React.CSSProperties = isMobile ? {} : {
        position: "fixed",
        width: "100%",
        zIndex: 1000,
    };

    return (
        <>
            <PageTab
                items={tabItems}
                matchChildPath={matchChildPath}
                style={{
                    backgroundColor: theme.palette.background.paper,
                    ...tabPositionStyle,
                }}
                tabProps={{
                    style: {
                        height: `${tabBarHeight}px`,
                    },
                    sx: {
                        boxShadow: isMobile ? undefined : appBar.boxShadowValue,
                    }
                }} />
            <div style={{
                paddingTop: isMobile ? undefined : `${tabBarHeight}px`
            }}>
                <PageContainer>
                    {children}
                </PageContainer>
            </div>
        </>
    );
}
