import { useMediaQuery } from "@mui/material";
import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageTab, PageTabItem } from "src/components/PageTab";
import { useAppTheme } from "src/context/Themes";

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
    
    let { padding } = usePagePadding()
    if(disableGutters)
        padding = "0px"

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

    const [preventScroll, setPreventScroll] = React.useState(false)

    const onTabClick = () => {
        setPreventScroll(true)
    }

    useTopScroller({ prevent: () => {
        const prevent = preventScroll
        setPreventScroll(false)
        return prevent
    }})

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
            <PageContainer disableScrollHandling={true}>
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

function useTopScroller( { 
    prevent 
}: { 
    prevent?: boolean | undefined | (() => boolean | undefined)
}) {
    const location = useLocation();

    useLayoutEffect(() => {
        const childHandlesScroll = !!location.hash

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