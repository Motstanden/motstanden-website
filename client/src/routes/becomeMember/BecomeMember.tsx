import { ThemeName, useAppTheme } from "../../context/Themes";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";

export default function BecomeMemberPage() {

    useTitle("Bli medlem!")
    return (
        <PageContainer disableGutters >
            <div style={{ paddingTop: "15px", paddingInline: "40px" }}>
                <h1 style={{ marginTop: 0 }}>Bli Medlem</h1>
                <p>
                    Ønsker du litt informasjon om Motstanden?<br />
                    Ønsker du å bli med?<br />
                </p>
                <p>
                    <b>Meld din interesse her!</b>
                </p>
                <p>
                    Vi tar kontakt med deg så fort som mulig!
                </p>
            </div>
            <GoogleForm />
        </PageContainer>
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
            paddingLeft: "10px",
            marginRight: "50px",
            width: "100%",
            height: "1100px",
            position: "relative"
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