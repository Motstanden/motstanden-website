import { Skeleton, Theme, useMediaQuery } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useAppTheme } from "src/context/Themes";
import May17Img from "../../assets/pictures/17mai2021.jpg";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer, usePagePadding } from "../../layout/PageContainer";
import { SimpleTextSkeleton } from "src/components/SimpleTextSkeleton";

const simpleTextKey = "front-page"

export default function FrontPage() {
    useTitle("Framside")

    const { theme } = useAppTheme()
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

    const { 
        paddingLeft: pagePaddingLeft,
        paddingRight: pagePaddingRight,
        paddingBottom: pagePaddingBottom,
    } = usePagePadding()

    return (
        <PageContainer disableGutters>
            <div style={
                isLargeScreen ? {
                    paddingTop: "50px",
                    paddingLeft: pagePaddingLeft,
                    paddingRight: pagePaddingRight,
                } : undefined}
            >
                <img src={May17Img}
                    alt="Motstanden feirer 17. Mai 2021"
                    style={{ 
                        width: "100%", 
                        maxHeight: "60vh",
                        objectFit: "cover",
                        maxWidth: theme.breakpoints.values.lg,
                        borderRadius: isLargeScreen ? "10px" : "0px",
                        borderWidth:  isLargeScreen ? "2px" : "0px",
                        borderStyle: "solid",
                        borderColor: theme.palette.divider,
                    }}
                />
            </div>
            <div style={{ 
                paddingLeft: pagePaddingLeft,
                paddingRight: pagePaddingRight,
                paddingBottom: pagePaddingBottom,
                maxWidth: "700px",
                fontSize: "14pt",
                lineHeight: "1.6",
                marginTop: "25px"
            }}>
                <SimpleTextFetcher
                    textKey={simpleTextKey} 
                    skeleton={<SimpleTextSkeleton numberOfSections={4}/>}
                />
            </div>
        </PageContainer>
    )
    
}