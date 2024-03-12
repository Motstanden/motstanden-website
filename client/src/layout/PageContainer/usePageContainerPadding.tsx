import { Theme, useMediaQuery } from "@mui/material";

const mediumPaddingTop = "0px"
const largePaddingTop = "15px"

const paddingBottom = "150px"

const tinyPaddingInline = "15px"
const smallPaddingInline = "min(70px, 2vw)"
const mediumPaddingInline = "min(80px, 3vw)"
const largePaddingInline = "min(100px, 4vw)"

interface PaddingProps { 
    paddingTop: string,
    paddingBottom: string,
    paddingLeft: string,
    paddingRight: string,
    padding: string
}

/** 
 * Custom hook to retrieve the padding for the page container.
 * This hook is useful for pages where the PageContainer has disableGutters set to true.
*/
export function usePageContainerPadding(): PaddingProps {
    const isTiny = useMediaQuery<Theme>(theme => theme.breakpoints.only('xs'));
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.only('sm'));
    const isMedium = useMediaQuery<Theme>(theme => theme.breakpoints.only('md'));
    const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up("lg"));

    let inlinePadding = "0px";
    if (isTiny) {
        inlinePadding = tinyPaddingInline;
    } else if (isSmall) {
        inlinePadding = smallPaddingInline;
    } else if (isMedium) {
        inlinePadding = mediumPaddingInline;
    } else if (isLarge) {
        inlinePadding = largePaddingInline;
    }

    let paddingTop = mediumPaddingTop
    if(isLarge) {
        paddingTop = largePaddingTop
    }

    const pagePadding = {
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        paddingLeft: inlinePadding,
        paddingRight: inlinePadding,
        padding: `${paddingTop} ${inlinePadding} ${paddingBottom} ${inlinePadding}`
    };

    return pagePadding;
}
