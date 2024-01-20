import { useMediaQuery } from "@mui/material";
import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageTab, PageTabItem, findActiveTab } from "src/components/PageTab";
import { useAppTheme } from "src/context/Themes";

const largePadding = "15Px min(100px, 4vw) 150px min(100px, 4vw)"
const mediumPadding = "15Px min(80px, 3vw) 150px min(80px, 3vw)"
const smallPadding = "15Px min(70px, 2vw) 150px min(70px, 2vw)"
const tinyPadding = "15px 15px 150px 15px"

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
    const { theme } = useAppTheme()

    const isSmall = useMediaQuery(theme.breakpoints.only('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.only('md'));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    let padding = tinyPadding
    if(disableGutters) {
        padding = "0px 0px"
    } else if (isSmall) {
        padding = smallPadding
    } else if (isMedium) {
        padding = mediumPadding
    } else if(isLarge) {
        padding = largePadding
    }

    useTopScroller({ prevent: disableScrollHandling })

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            paddingBottom: "150px",
            padding: padding,
            ...props,
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
    const { theme } = useAppTheme()

    const location = useLocation()
    const urlMatchesTab = () => !!findActiveTab(tabItems, location, { matchChildPath: matchChildPath })
    useTopScroller({ prevent: urlMatchesTab})

    return (
        <>
            <PageTab 
                items={tabItems} 
                matchChildPath={matchChildPath}
                style={{
                    backgroundColor: theme.palette.background.paper
                }} 
            />
            <PageContainer disableScrollHandling={true}>
                <div>
                    {children}
                </div>
            </PageContainer>
        </>
    )
}

function useTopScroller( { 
    prevent 
}: { 
    prevent?: boolean | undefined | (() => boolean | undefined)
}) {
    const location = useLocation();

    useLayoutEffect(() => {
        const childHandlesScroll = location.hash

        let preventScroll = false
        if(typeof prevent === "function") {
            preventScroll = prevent() ?? false
        } else if(typeof prevent === "boolean") {
            preventScroll = prevent
        }

        const shouldScroll = !childHandlesScroll && !preventScroll 

        if (shouldScroll) {
            window.scrollTo({ top: 0, left: 0})
        }
    }, [location.pathname])   
}