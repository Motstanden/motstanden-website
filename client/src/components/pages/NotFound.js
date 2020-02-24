import React from "react"
import styles from "./NotFound.module.css"
import londonImage from "../../images/london_small.png"




class NotFound extends React.Component {
    render() {
        return (
            <main className={styles.mainStyle}>
                <div>
                    <h1 className={styles.fourOFour}>
                        404
                    </h1>
                    <h2 className={styles.notFoundTitle}>
                            Beklager, siden du leter etter er i London
                    </h2>
                </div>
                <img src={londonImage} 
                    className={styles.londonImageStyle}
                    alt="Motstanden-medlem i London"
                ></img>
                <div />
                <h1 className={styles.londonFacts}>
                    Fakta om London på engelsk:
                </h1>
                <ul className={styles.londonFacts}>
                    <li>
                        London is the biggest city in Britain and in Europe. 
                    </li>
                    <li>
                        London occupies over 620 square miles
                    </li>
                    <li>
                        London has a population of 7,172,036 (2001) 
                    </li>
                    <li>
                        About 12% of Britain’s overall population live in London (1998)
                    </li>
                    <li>
                        London is in the southeast of England. 
                    </li>
                    <li>
                        The tallest building in London is the Canary Wharf Tower. 
                    </li>
                </ul>
                    
            </main>
        )
    }
}
export default NotFound