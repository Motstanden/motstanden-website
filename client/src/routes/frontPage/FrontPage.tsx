import React from "react"
import Link from '@mui/material/Link';
import May17Img from "../../assets/pictures/17mai2021.jpg"
import { PageContainer } from "../../layout/PageContainer";
import { useTitle } from "../../hooks/useTitle";

const linkStyle = {
    color: "secondary.light",
    "&:visited": {
        color: "secondary.dark"
    },
    "&:hover": {
        color: "secondary.main"
    },
}

export default function FrontPage(){
    useTitle("Framside")
    return (
        <PageContainer disableGutters>
            <img src={May17Img}
                alt="Motstanden feirer 17. Mai 2021" 
                loading="lazy" 
                style={{width: "100%", maxHeight: "33vh", objectFit: "cover"}}/>
            <div style={{paddingInline: "35px", paddingBottom: "100px", maxWidth: "700px"}}>
                <h2>Om oss</h2>
                    <p>
                        Studentorchesteret den Ohmske Motstanden er et studentorchester som tilhører Linjeforeningen Elektra ved NTNU i Trondheim.
                        <br/>
                        Hovedformålet til Motstanden er å tilby et lavterskel musikalsk- sosialtilbud for medlemmer av Elektra. 
                    </p>
                    <br/>
                <h2>Bli medlem?</h2>
                    <p>
                        Alle som er medlem i Elektra kan bli medlem i Motstanden. 
                        <br/>
                        Det stilles overhodet ingen krav til ferdigheter for å bli med. 
                        <br/>
                        Kan du spille et instrument så er det kjempeflott, men musikalsk erfaring er absolutt ikke et krav!
                        <br/>
                        Det viktigste i Motstanden er å ha det gøy og å være sosial! 
                    </p>
                    <br/>
                <h2>Øvelse</h2>
                    <p>
                       <b>Motstanden har øvelse på Elektrakontoret hver tirsdag fra 19:00 til 21:00.</b>
                        <br/> 
                        <br/>
                        Etter øvelsen pleier vi å dra på Samfundet eller finne på noe sosialt på kontoret.
                        <br/>
                        Øvelsene er åpne for alle, så det er bare å møte opp med godt humør, <b>og gjerne et par pils...</b>
                    </p>
                    <br/>
                <h2>Kontakt oss</h2>
                    <p>
                        Er det noe du lurer på? Kontakt oss gjerne på:
                        <ul>
                            <li><Link sx={linkStyle} underline="hover" href="mailto:styret@motstanden.no">styret@motstanden.no</Link></li>    
                            <li><Link sx={linkStyle} underline="hover" href="https://www.facebook.com/Motstanden">Facebook</Link></li>
                            <li><Link sx={linkStyle} underline="hover" href="https://instagram.com/denohmskemotstanden">Instagram</Link></li>
                            <li><Link sx={linkStyle} underline="hover" href="https://vm.tiktok.com/ZMNVv1Tk3/">TikTok</Link></li>
                        </ul> 
                    </p>
            </div>
        </PageContainer>
    )
}

