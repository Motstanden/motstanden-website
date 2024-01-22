import { useMediaQuery } from "@mui/material";
import React from "react";
import { PageTab, PageTabItem } from "src/components/PageTab";
import { useAppTheme } from "src/context/Themes";

export function PageContainer({
    children,
    props,
    disableGutters,
}: {
    children?: React.ReactNode,
    props?: React.CSSProperties,
    disableGutters?: boolean,
}) {
    const { theme } = useAppTheme()
    
    let { padding } = usePagePadding()
    if(disableGutters)
        padding = "0px"

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

const tabBarHeight = 48

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

    const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

    const tabPositionStyle: React.CSSProperties = isMobile ? {} : {
        position: "fixed",
        width: "100%",
        zIndex: 1000,
    }

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
                    }
                }}
            />
            <div style={{
                paddingTop: isMobile ? undefined : `${tabBarHeight}px`
            }}>
                <PageContainer>
                        {children}
                </PageContainer>
            </div>
        </>
    )
}

const paddingTop = "15px"
const paddingBottom = "150px"

const tinyPaddingInline = "15px"
const smallPaddingInline = "min(70px, 2vw)"
const mediumPaddingInline = "min(80px, 3vw)"
const largePaddingInline = "min(100px, 4vw)"

export function usePagePadding() {
    const { theme } = useAppTheme()

    const isTiny = useMediaQuery(theme.breakpoints.only('xs'));
    const isSmall = useMediaQuery(theme.breakpoints.only('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.only('md'));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

    let inlinePadding = "0px"
    if (isTiny) {
        inlinePadding = tinyPaddingInline
    } else if (isSmall) {
        inlinePadding = smallPaddingInline
    } else if (isMedium) {
        inlinePadding = mediumPaddingInline
    } else if(isLarge) {
        inlinePadding = largePaddingInline
    }   

    const pagePadding = {
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        paddingLeft: inlinePadding,
        paddingRight: inlinePadding,
        padding: `${paddingTop} ${inlinePadding} ${paddingBottom} ${inlinePadding}`
    }

    return pagePadding
}