import { Stack, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./appBar/ResponsiveAppBar";
import { FooterContent } from "./Footer";

export function AppLayout() {
    const theme = useTheme()
    return (
        <Stack direction="column" minHeight="100vh">
            <header>
                <ResponsiveAppBar />
            </header>
            <main style={{ minHeight: "100vh", color: theme.palette.text.secondary }}>
                <Outlet />
            </main>
            <footer>
                <FooterContent />
            </footer>
        </Stack>
    )
}