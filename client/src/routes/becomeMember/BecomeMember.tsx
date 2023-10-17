import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useAuth } from "src/context/Authentication";
import { ThemeName, useAppTheme } from "../../context/Themes";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";

const simpleTextKey = "become-member"

export default function BecomeMemberPage() {
    useTitle("Bli medlem!")
    
    const user = useAuth().user
    const isAdmin = !!user && hasGroupAccess(user, UserGroup.Administrator)

    return (
        <PageContainer  >
            <div style={{ 
                maxWidth: "700px",
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
                <GoogleForm />
            </div>
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
    const invertProps = theme.name === ThemeName.Dark
        ? { filter: "invert(100%) hue-rotate(180deg)" }
        : {}
    return (
        <div style={{
            overflow: "hidden",
            marginLeft: "-20px",
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