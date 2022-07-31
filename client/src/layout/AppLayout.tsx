import React from "react"
import { Outlet } from "react-router-dom"
import Stack from "@mui/material/Stack"

import ResponsiveAppBar from "./appBar/ResponsiveAppBar"
import { FooterContent } from "./Footer"

export function AppLayout(){
    return(
        <Stack direction="column" minHeight="100vh">
            <header>
                <ResponsiveAppBar/>
            </header>
            <main style={{minHeight: "100vh"}}>
                <Outlet/>
            </main>
            <footer>
                <FooterContent/>
            </footer>
        </Stack>
    )
}