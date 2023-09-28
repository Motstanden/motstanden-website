import { Link } from "@mui/material";
import May17Img from "../../assets/pictures/17mai2021.jpg";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";

const linkStyle = {
    color: "secondary.light",
    "&:visited": {
        color: "secondary.dark"
    },
    "&:hover": {
        color: "secondary.main"
    },
}

export default function FrontPage() {
    useTitle("Framside")
    return (
        <PageContainer disableGutters>
            <img src={May17Img}
                alt="Motstanden feirer 17. Mai 2021"
                style={{ 
                    width: "100%", 
                    maxHeight: "33vh", 
                    objectFit: "cover"
                 }}
             />
            <div style={{ 
                paddingInline: "35px", 
                paddingBottom: "100px", 
                maxWidth: "700px",
                fontSize: "14pt",
                lineHeight: "1.6",
            }}>
                <h2>Om oss</h2>
                <p>
                    Studentorchesteret den Ohmske Motstanden er et studentorchester som tilhører Linjeforeningen Elektra ved NTNU i Trondheim.
                    Hovedformålet til Motstanden er å tilby et lavterskel musikalsk- sosialtilbud for medlemmer av Elektra.
                </p>
                <h2 style={{paddingTop: "20px"}}>
                    Bli medlem?
                </h2>
                <p>
                    Alle som er medlem i Elektra kan bli medlem i Motstanden.
                    Det stilles overhodet ingen krav til ferdigheter for å bli med.
                    Kan du spille et instrument så er det kjempeflott, men musikalsk erfaring er absolutt ikke et krav!
                    Det viktigste i Motstanden er å ha det gøy og å være sosial!
                </p>
                <h2 style={{paddingTop: "20px"}}>
                    Øvelse
                </h2>
                <p>
                    <b>Motstanden har øvelse på Elektrakontoret hver torsdag fra 19:00 til 21:00.</b>
                </p>
                <p>
                    Etter øvelsen pleier vi å dra på Samfundet eller finne på noe sosialt på kontoret.
                    Øvelsene er åpne for alle, så det er bare å møte opp med godt humør, <b>og gjerne et par pils...</b>
                </p>
                <h2 style={{paddingTop: "20px"}}>
                    Kontakt oss
                </h2>
                <p>
                    Er det noe du lurer på? Kontakt oss gjerne på:
                </p>
                <ul>
                    <li><Link sx={linkStyle} underline="hover" href="mailto:styret@motstanden.no">styret@motstanden.no</Link></li>
                    <li><Link sx={linkStyle} underline="hover" href="https://www.facebook.com/Motstanden">Facebook</Link></li>
                    <li><Link sx={linkStyle} underline="hover" href="https://instagram.com/denohmskemotstanden">Instagram</Link></li>
                    <li><Link sx={linkStyle} underline="hover" href="https://vm.tiktok.com/ZMNVv1Tk3/">TikTok</Link></li>
                </ul>
            </div>
        </PageContainer>
    )
}

