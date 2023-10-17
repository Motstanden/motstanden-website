import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useAuth } from "src/context/Authentication";
import { ThemeName, useAppTheme } from "../../context/Themes";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";
import { useMediaQuery } from "@mui/material";

const simpleTextKey = "become-member"

export default function BecomeMemberPage() {
    useTitle("Bli medlem!")
    
    const user = useAuth().user
    const isAdmin = !!user && hasGroupAccess(user, UserGroup.Administrator)

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
                    canEdit={isAdmin}
                    skeleton={<TextSkeleton/>}
                />
            </div>
            <GoogleForm />
        </PageContainer>
    )
}

function TextSkeleton() {
    return (
        <></>   // TODO
    )
}


function GoogleForm() {
    const theme = useAppTheme();

    const isTinyScreen = useMediaQuery("(max-width: 400px)")
    const isSmallScreen = useMediaQuery("(max-width: 600px)")
    
    let style: React.CSSProperties = {
        marginLeft: "-30px"
    }

    if(isSmallScreen) {
        style = {
            marginLeft: "-20px"
        }
    }

    if(isTinyScreen) {
        style = {
            marginLeft: "00px"
        }
    }

    const invertProps = theme.name === ThemeName.Dark
        ? { filter: "invert(100%) hue-rotate(180deg)" }
        : {}
        
    return (
        <div style={{
            ...style,
            overflow: "hidden",
            width: "100%",
            height: "1100px",
        }}>
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdJwbR3AjGFGwLXaOXYEzhohegIj5DIXf75e87CX2EoogwinA/viewform?embedded=true"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
                style={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "700px",
                    overflow: "hidden",
                    ...invertProps
                }}>
                Laster inn…
            </iframe>
        </div>
    )
}