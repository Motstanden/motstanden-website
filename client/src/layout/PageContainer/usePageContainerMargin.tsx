import { Theme, useMediaQuery } from "@mui/material";

const tinyMarginTop = "25px"
const smallMarginTop = "30px"
const mediumMarginTop = "37px"
const largeMarginTop = "43px"

const marginBottom = "150px"

const tinyMarginInline = "15px"
const smallMarginInline = "min(70px, 2vw)"
const mediumMarginInline = "min(80px, 3vw)"
const largeMarginInline = "min(100px, 4vw)"

interface MarginProps { 
    top: string,
    bottom: string,
    left: string,
    right: string,
    margin: string
}

/** 
 * Custom hook to retrieve the margin for the page container.
 * This hook is useful for pages where the PageContainer has disableGutters set to true.
*/
export function usePageContainerMargin(): MarginProps {
    const isTiny = useMediaQuery<Theme>(theme => theme.breakpoints.only('xs'));
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.only('sm'));
    const isMedium = useMediaQuery<Theme>(theme => theme.breakpoints.only('md'));
    const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up("lg"));

    let inlineMargin = "0px";
    let marginTop = "0px"
    if (isTiny) {
        inlineMargin = tinyMarginInline;
        marginTop = tinyMarginTop
    } else if (isSmall) {
        inlineMargin = smallMarginInline;
        marginTop = smallMarginTop
    } else if (isMedium) {
        inlineMargin = mediumMarginInline;
        marginTop = mediumMarginTop
    } else if (isLarge) {
        inlineMargin = largeMarginInline;
        marginTop = largeMarginTop
    }

    const pageMargin = {
        top: marginTop,
        bottom: marginBottom,
        left: inlineMargin,
        right: inlineMargin,
        margin: `${marginTop} ${inlineMargin} ${marginBottom} ${inlineMargin}`
    };

    return pageMargin;
}
