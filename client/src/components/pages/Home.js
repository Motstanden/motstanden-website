import React from "react"
import styles from "./home.module.css"
import FacebookComponent from "../FacebookComponent.js"



class Home extends React.Component {
    render() {
        return (
            <div>
                {/* <img src={forohmingen} className={styles.frontImage}></img> */}
                <main>
                    <div className={styles.frontImage}></div>
                    <div className={styles.text}> 
                        <div className={styles.gridContainer}>
                            <div className={styles.item1}>
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
                            
                            <div className={styles.gridItem}>
                            <div className={styles.silhuett}>
                                {/* <img src={silhuett} className={styles.silhuett}></img> */}
                            </div>
                                <div className={styles.faceBox}>
                                    <FacebookComponent/>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default Home