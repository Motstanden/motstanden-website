import React from "react"
import styles from "./footer.module.css"

import motstandenLogoLowres from "../images/motstanden_logo_lowres.png"
import elektraLogo from  "../images/elektra_logo.png"

class Footer extends React.Component {
    render() {
        return (
            <footer className={styles.footer}>
                <div className = {styles.grid}>
                    <div className={styles.bigLogoAndInfoContainer}>
                        <div>
                            <img src={motstandenLogoLowres} className={styles.bigLogo} alt="Logoen til Motstanden"></img>
                        </div>
                        <div>
                            <ul>
                                <li>styret@motstanden.no</li>
                                <li>
                                    {/* <span className={styles.iconContainer}>
                                        <img src={facebookLogo} className={styles.icon}></img> 
                                    </span> */}
                                    <a href="https://www.facebook.com/Motstanden" >Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.bigLogoAndInfoContainer}>
                        <div>
                            <img src={elektraLogo} className={styles.bigLogo} alt="Logoen til Elektra"></img>
                        </div>
                        <div>                    
                        <ul>
                            <li>styret@elektra.io</li>
                            <li><a href="https://elektra.io/">Elektra.io</a></li>
                            <li><a href="https://www.facebook.com/elektraNTNU/">Facebook</a></li>
                            <li><a href="https://www.instagram.com/elektrantnu">Instagram</a></li>
                        </ul>
                        </div>
                    </div>
                    <div className={styles.AddressInfo} >
                        <ul>
                            <li>NTNU Gløshaugen</li>
                            <li>Høgskoleringen 3</li>
                            <li>7034 Trondheim</li>
                            <li>Org nr: 991107711</li>
                        </ul>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer