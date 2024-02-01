import React from "react";
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
    let { padding } = usePageContainerPadding()
    if(disableGutters)
        padding = "0px"

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            padding: padding,
            ...props,
        }}>
            {children}
        </div>
    );
}