import { useMediaQuery } from "@mui/material";
import React from "react";
import { PageTab, PageTabItem } from "src/components/PageTab";
import { useAppTheme } from "src/context/Themes";
import { useTopScroller } from "src/context/TopScroller";

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

    const { preventNextScroll } = useTopScroller()

    const onTabClick = () => {
        preventNextScroll(true)
    }

    return (
        <>
            <PageTab 
                items={tabItems} 
                matchChildPath={matchChildPath}
                style={{
                    backgroundColor: theme.palette.background.paper
                }}
                onTabClick={onTabClick}
            />
            <PageContainer>
                <div>
                    {children}
                </div>
            </PageContainer>
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