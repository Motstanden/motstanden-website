import React from "react";
import { usePageContainerMargin } from "./usePageContainerMargin";

export function PageContainer({
    children,
    style,
    disableGutters,
}: {
    children?: React.ReactNode,
    style?: React.CSSProperties,
    disableGutters?: boolean,
}) {
    let {top, left, right, bottom} = usePageContainerMargin()
    if(disableGutters) {
        top = "0px"
        left = "0px"
        right = "0px"
        bottom = "0px"
    }
    
    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            
            marginTop: top,
            marginBottom: bottom,

            paddingLeft: left,
            paddingRight: right,

            ...style,
        }}>
            {children}
        </div>
    );
}