import { useMediaQuery, useScrollTrigger } from "@mui/material";
import React, { useEffect } from "react";
import { PageTab, PageTabItem } from "src/components/PageTab";
import { appBarBoxShadow, useAppBarStyle } from "src/context/AppBarStyle";
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

    const { addBoxShadow, removeBoxShadow } = useAppBarStyle();

    useEffect(() => {
        removeBoxShadow();
        return () => addBoxShadow();
    }, []);

    useEffect(() => {
        if (isMobile) {
            addBoxShadow();
        } else {
            removeBoxShadow();
        }
    }, [isMobile]);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });
    const boxShadow = trigger ? appBarBoxShadow : 0;

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
                        boxShadow: isMobile ? undefined : boxShadow,
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
