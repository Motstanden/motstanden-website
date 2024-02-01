import React from "react";
import { useAppTheme } from "src/context/Themes";
import { usePageContainerPadding } from "./usePageContainerPadding";

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
    
    let { padding } = usePageContainerPadding()
    if(disableGutters)
        padding = "0px"

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            padding: padding,
            ...props,
        }}>
            {children}
        </div>
    );
}