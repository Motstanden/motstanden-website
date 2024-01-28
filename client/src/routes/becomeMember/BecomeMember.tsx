import { Skeleton, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { SimpleTextSkeleton } from "src/components/SimpleTextSkeleton";
import { ThemeName, useAppTheme } from "../../context/Themes";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";

const simpleTextKey = "become-member"

export default function BecomeMemberPage() {
    useTitle("Bli medlem!")
    
    return (
        <PageContainer  >
            <div style={{ 
                maxWidth: "640px",
                fontSize: "14pt",
                lineHeight: "1.6",
                marginTop: "25px",
                marginLeft: "5px",
                marginBottom: "35px",
            }}>
                <SimpleTextFetcher
                    textKey={simpleTextKey} 
                    skeleton={<SimpleTextSkeleton/>}
                />
            </div>
            <GoogleFormLoader/>
        </PageContainer>
    )
}

function GoogleFormLoader() {
    const [isLoading, setIsLoading] = useState(true)

    const onLoad = () => {
        setIsLoading(false)
    }

    return (
        <>
            <GoogleForm onLoad={onLoad} style={{display: isLoading  ? "none" : "block"}} />
            <GoogleFormSkeleton style={{display: isLoading ? "block" : "none"}} />
        </>
    )
}

function GoogleFormSkeleton({ style }: { style?: React.CSSProperties}) { 
    return (
        <div style={style}>
            <Skeleton 
                variant="rounded"
                width="100%"
                height="750px"
                style={{
                    maxWidth: "650px", 
                    borderRadius: "10px"
                }}
            />
        </div>
    )
}

function GoogleForm({
    onLoad,
    style
}: {
    onLoad?: () => void,
    style?: React.CSSProperties
}) {
    const theme = useAppTheme();

    const isSmallScreen = useMediaQuery("(max-width: 600px)")
    const isMediumScreen = useMediaQuery("(max-width: 850px)")

    const baseStyle: React.CSSProperties =  
        isSmallScreen ? 
            { marginLeft: " 0px" } :
        isMediumScreen ? 
            { marginLeft: "-10px" } :
            { marginLeft: "-30px" } 


    const invertProps = theme.name === ThemeName.Dark
        ? { filter: "invert(100%) hue-rotate(180deg)" }
        : {}
        
    return (
        <>
            <div style={{
                ...baseStyle,
                overflow: "hidden",
                width: "100%",
                height: "1100px",
                ...style,
            }}>
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdJwbR3AjGFGwLXaOXYEzhohegIj5DIXf75e87CX2EoogwinA/viewform?embedded=true"
                    allowFullScreen
                    frameBorder="0"
                    scrolling="no"
                    onLoad={onLoad}
                    style={{
                        height: "100%",
                        width: "100%",
                        maxWidth: "700px",
                        overflow: "hidden",
                        ...invertProps
                    }}/>
            </div>
        </>
    )
}