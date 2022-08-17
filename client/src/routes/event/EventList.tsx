import React from "react"
import { Button } from "@mui/material"
import {Link as RouterLink } from "react-router-dom"

export function EventListPage(){

    return (
        <>
            <h1>Arrangement</h1>
            <br/>
            <Button 
                variant="contained" 
                component={RouterLink}
                to="/arrangement/ny"
                >
                    Nytt arrangement
            </Button>

        </>
    )
}