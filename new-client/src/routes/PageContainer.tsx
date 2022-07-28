import React from "react";
import { useTheme } from '@mui/material';

export function PageContainer({ children, props, disableGutters }: { children: React.ReactNode; props?: React.CSSProperties; disableGutters?: boolean; }) {
    const theme = useTheme();
    const paddingX = disableGutters ? { padding: "0px 0px"} : { padding: "15Px 5%" };
    return (
        <div style={{
            minHeight: "100vh",
            maxWidth: "1200px",
            marginInline: "auto",
            backgroundColor: theme.palette.background.paper,
            paddingBottom: "150px",
            ...paddingX,
            ...props
        }}>
            {children}
        </div>
    );
}
