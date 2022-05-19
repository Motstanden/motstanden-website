import React from "react"
import { Outlet } from "react-router-dom"

import ResponsiveAppBar from "./appBar/ResponsiveAppBar"

export default function PageLayout(){
    return(
        <>
            <header>
                <ResponsiveAppBar/>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                {/* TODO: Write footer here */}
            </footer>
        </>
    )
}
