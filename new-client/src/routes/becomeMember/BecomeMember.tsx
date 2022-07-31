import { InvertColors } from "@mui/icons-material";
import { height } from "@mui/system"
import React, { useRef } from "react"
import { ThemeName, useAppTheme } from "../../context/Themes"
import { PageContainer } from "../../layout/PageContainer"

export default function BecomeMember() {

    return (
        <PageContainer disableGutters >
            <div style={{ paddingTop: "15px", paddingInline: "40px"}}>
                <h1 style={{marginTop: 0 }}>Bli Medlem</h1>
                <p>
                    Ønsker du litt informasjon om Motstanden?<br/> 
                    Ønsker du å bli med?<br/> 
                </p>
                <p>
                    <b>Meld din interesse her!</b> 
                </p>
                <p> 
                    Vi tar kontakt med deg så fort som mulig! 
                </p>
            </div>
            <GoogleForm/>
        </PageContainer>
    )
}

function GoogleForm(){
    const theme = useAppTheme();
    const invertProps = theme.name === ThemeName.Dark 
        ? { filter:"invert(100%) hue-rotate(180deg)" }
        : { }
    return (
        <div style={{
            overflow: "hidden",
            paddingInline: "10px",
            width: "100%",
            height: "1100px",
        }}>
            <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLScNCnQSOnjrQ8eroEnJdc5WCg8uIkPePjnQX1NehdmxyBT-kQ/viewform?embedded=true"
                allowFullScreen 
                frameBorder="0"
                style={{
                    height: "100%",
                    width: "100%",
                    ...invertProps
                }}>
                    Laster inn …
            </iframe>
        </div>
    )
}