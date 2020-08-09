import React from "react"
import styles from "./home.module.css"
import FacebookComponent from "../FacebookComponent.js"
import {
    Link,
    withRouter
} from "react-router-dom"

import silhouetteImg from "../../images/silhuett_liten.png"


class Home extends React.Component {
    render() {
        return (
            <div>
                {/* <img src={forohmingen} className={styles.frontImage}></img> */}
                <main>
                    <div className={styles.frontImage}/>
                    <div className={styles.gridContainer}>
                        <div>
                            <h1>Bli medlem?</h1>
                            <p>
                                Har du planer om å bli medlem eller er medlem av linjeforeningen Elektra&trade;?<br/> 
                                Ønsker du å fylle musikklivet ditt med store mengder spenning?<br/>
                                Føler du deg ladet opp til ett spenningsdyktig studentliv med festing og moro?
                            </p>
                            <p>
                                Komplementer kretsen din med Motstanden, notorisk kjent for strømmende toner i lav 
                                terskel, og bordbrytende dirigeringer!<br/> 
                                Sammen med oss vil du få oppfylt barndomsdrømmen om å spille akustisk musikk i et 
                                stort orchester!
                            </p>
                            <div className={styles.joinUsButtonContainer}>
                                <Link to="/bli-medlem" className={styles.buttonStyle} > 
                                        Meld deg på her!
                                </Link>
                            </div>
                        </div>
                        <div className={styles.silhouetteContainer}>
                            <img src={silhouetteImg} className={styles.silhouetteImg}></img>

                        </div>
                        <div>
                            <h1>I en sluttet krets!</h1>
                            <p>
                                Studentorchesteret den Ohmske Motstanden er Trondheims nyeste bidrag til studentorchestermiljøet,
                                en landsdekkende studentaktivitet som bringer hundrevis av spilleglade studenter sammen på seks av
                                landets universiteter (det kan være fler vi ikke vet om). Hvert semester arrangeres et nasjonalt
                                orchestertreff (<a href="http://org.ntnu.no/smash/2017/kort_om_smash.php">SMASH</a>), et tradisjonsrikt
                                arrangement med røtter tilbake til 1965.
                            </p>
                            <p>
                                Siden Motstanden ble stiftet 11. sept 2018 har vi gått fra seks til nesten tjue medlemmer og har
                                blitt godt kjent med de andre orchesterene både i Trondheim og resten av landet.
                            </p>
                            <p>
                                Motstanden er organisert under <a href="https://elektra.io">Linjeforeningen Elektra</a>, så dersom du er student
                                på bachelorstudiet Elektroingeniør ved NTNU eller av en annen grunn er medlem av Elektra er du velkommen
                                hos oss! Vi øver hver tirsdag kl 19.00 på Elektrakontoret, så dersom du er interessert eller bare vil
                                henge med oss etter øving er det bare å dukke opp.
                            </p>
                            <p>
                                Ønsker du et uforglemmelig musikalsk innslag på julebordet/bursdagen/bedriftsfesten? Motstanden tar
                                spillejobber! Kontakt oss på styret@motstanden.no
                            </p>
                        </div>
                        
                        <div className={styles.faceBox}>
                            <FacebookComponent/>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default withRouter(Home)