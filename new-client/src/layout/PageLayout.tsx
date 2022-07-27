import React from "react"
import { Outlet } from "react-router-dom"
import { Stack } from "@mui/material"

import ResponsiveAppBar from "./appBar/ResponsiveAppBar"
import { FooterContent } from "./Footer"

export default function PageLayout(){
    return(
        <Stack minHeight="100vh">
            <header>
                <ResponsiveAppBar/>
            </header>
            <main style={{minHeight: "75vh"}}>
                <Outlet/>
            </main>
            <footer style={{marginTop: "Auto"}}>
                <FooterContent/>
            </footer>
        </Stack>
    )
}