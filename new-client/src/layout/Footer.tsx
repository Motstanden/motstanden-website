import React from "react"
import { Divider, Grid, Paper, Stack, Typography } from "@mui/material"
import { Container as Box } from "@mui/system"

export function FooterContent(){
    return  (
        <Paper elevation={4}>
            <Stack bgcolor="secondary.main">
                <Stack 
                    color="secondary.contrastText"
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={4}
                    paddingY={5}
                    paddingX={5}
                    marginX="auto"
                    width="100%"
                    maxWidth={1600}
                    >
                    <MotstandenInfo/>
                    <Divider 
                        textAlign="center"
                        flexItem 
                        sx={{
                            "&::before, &::after": {
                                borderColor: "secondary.contrastText",
                            },
                        }}
                        >
                            SPONSORER
                    </Divider>
                    <SponsorInfo/>
                </Stack>
            </Stack>
        </Paper>
    )
}

function MotstandenInfo(){
    return (
        <Grid 
            container   
            zeroMinWidth
            direction="row"
            columnSpacing={10}
            rowSpacing={2}
            justifyContent="center"
            alignItems="center"
            textAlign="center">
            <Grid item xs={12} sm={4} md={3}>
                <MotstandenLogo />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
                <Typography variant="h6" >
                    Studentorchesteret <wbr/>
                    <NoBr>den Ohmske</NoBr> <wbr/>
                    Motstanden
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3} sx={{whiteSpace: "nowrap"}}>
                <Typography>styret@motstanden.no</Typography>
                <Typography>Org: 929095618</Typography>   
                <br/>
                <Typography>NTNU Gløshaugen</Typography>
                <Typography>Høgskoleringen 3</Typography>
                <Typography>7034 Trondheim</Typography> 
            </Grid>
        </Grid>
    )
}

function SponsorInfo(){
    return (
        <Grid
            container 
            direction="row"
            textAlign="center" 
            columnSpacing={{sm: 4}}
            justifyContent="center"
            >
            <Grid item xs={12} sm={6} marginBottom={{xs: 4, sm: 0}}>
                <Typography>Linjeforeningen Elektra</Typography>
                <ElektraLogo/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography>Studentsamskipnaden i Trondheim</Typography>
                <SitLogo/>
            </Grid>
        </Grid>
    )
}

// TODO: Find logo
function MotstandenLogo(){
    return (
        <img alt="Motstanden sin logo"/>
    )
}

// TODO: Find logo
function ElektraLogo(){
    return (
        <img alt="Elektra sin logo"/>
    )
}

// TODO: Find logo
function SitLogo(){
    return (
        <img alt="Sit sin logo"/>
    )
}

// Helper function to prevent line break for html or text elements
function NoBr({ children }: {children: React.ReactNode}) {
    return (
        <span style={{whiteSpace: "nowrap"}}>
            {children}
        </span>
    )
}