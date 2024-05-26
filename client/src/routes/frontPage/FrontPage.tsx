import { Theme, useMediaQuery } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { SimpleTextSkeleton } from "src/components/SimpleTextSkeleton";
import { useAppBarHeader } from "src/context/AppBarHeader";
import { useAppTheme } from "src/context/AppTheme";
import { usePageContainerMargin } from "src/layout/PageContainer/usePageContainerMargin";
import May17Img from "../../assets/pictures/17mai2021.jpg";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer/PageContainer";

const simpleTextKey = "front-page"

export default function FrontPage() {
    useTitle("Framside")
    useAppBarHeader("Den ohmske Motstanden")

    const { theme } = useAppTheme()
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

    const { 
        left: pageMarginLeft,
        right: pageMaringRight,
        bottom: pageMarginBottom,
    } = usePageContainerMargin()

    return (
        <PageContainer disableGutters>
            <div style={
                isLargeScreen ? {
                    marginTop: "50px",
                    paddingLeft: pageMarginLeft,
                    paddingRight: pageMaringRight,
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
                marginLeft: pageMarginLeft,
                marginRight: pageMaringRight,
                marginBottom: pageMarginBottom,
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