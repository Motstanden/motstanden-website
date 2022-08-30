import React from "react";
import { useTheme } from "@mui/material";

export const defaultPagePadding = "15Px 35px 150px 35px"

export function PageContainer({ children, props, disableGutters }: { children: React.ReactNode; props?: React.CSSProperties; disableGutters?: boolean; }) {
    const theme = useTheme();
    const padding = disableGutters ? { padding: "0px 0px" } : { padding: defaultPagePadding };
    return (
        <div style={{
            minHeight: "100vh",
            maxWidth: "1200px",
            marginInline: "auto",
            backgroundColor: theme.palette.background.paper,
            paddingBottom: "150px",
            ...padding,
            ...props
        }}>
            {children}
        </div>
    );
}