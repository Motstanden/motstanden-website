import React from "react"
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import May17Img from "../../assets/pictures/17mai2021.jpg"

export default function FrontPage(){
    const theme = useTheme()
    return (
        <div style={{
            minHeight: "100vh", 
            maxWidth: "1200px", 
            marginInline:"auto", 
            backgroundColor: theme.palette.background.paper, 
            paddingBottom: "150px"
        }}>
            <img src={May17Img}
                alt="Motstanden feirer 17. Mai 2021" 
                loading="lazy" 
                style={{width: "100%", maxHeight: "30vh", objectFit: "cover"}}/>
                <div style={{paddingInline: "3%"}}>
                    <h2>Om oss</h2>
                        <p>
                            #TODO...?
                        </p>
                        <br/>
                    <h2>Bli medlem?</h2>
                        <p>
                            #TODO...?
                        </p>
                        <br/>
                    <h2>Øvelse</h2>
                        <p>
                            #TODO...?
                        </p>
                        <br/>
                    <h2>Kontakt oss</h2>
                        <p>
                            #TODO...?
                        </p>
                </div>
        </div>
    )
}
