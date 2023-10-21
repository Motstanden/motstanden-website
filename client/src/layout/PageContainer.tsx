import { Theme, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocation, Location } from "react-router-dom";
import { PageTab, PageTabItem } from "src/components/PageTab";
import { matchUrl } from "src/utils/matchUrl";

const defaultPadding = "15Px 35px 150px 35px"
const smallScreenPadding = "15px 15px 150px 15px"

export function PageContainer({
    children,
    props,
    disableGutters,
    disableScrollHandling
}: {
    children?: React.ReactNode,
    props?: React.CSSProperties,
    disableGutters?: boolean,
    disableScrollHandling?: boolean
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery((_theme: Theme) => _theme.breakpoints.down('sm'));

    let padding = isSmallScreen ? smallScreenPadding : defaultPadding
    if (disableGutters)
        padding = "0px 0px"

    const location = useLocation();
    useLayoutEffect(() => {
        const childHandlesScroll = location.hash
        if(!disableScrollHandling && !childHandlesScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
    }, [location.pathname])

    return (
        <div style={{
            minHeight: "100vh",
            maxWidth: "1200px",
            marginInline: "auto",
            backgroundColor: theme.palette.background.paper,
            paddingBottom: "150px",
            padding: padding,
            ...props
        }}>
            {children}
        </div>
    );
}

export function TabbedPageContainer({
    children,
    tabItems,
    matchChildPath
}: {
    children: React.ReactNode,
    tabItems: PageTabItem[],
    matchChildPath?: boolean
}) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const location = useLocation();
    useLayoutEffect(() => {
        const isTabClick = tabItems.find(item => matchUrl(item.to, location, { matchChildPath: false }))         // Scroll to top if the new url is not equal to a tab url
        const childHandlesScroll = location.hash
        if (!isTabClick && !childHandlesScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
    }, [location.pathname])

    return (
        <PageContainer disableGutters={isSmallScreen} disableScrollHandling={true}>
            <PageTab items={tabItems} matchChildPath={matchChildPath} />
            <div style={{ padding: isSmallScreen ? smallScreenPadding : 0 }}>
                {children}
            </div>
        </PageContainer>
    )
}