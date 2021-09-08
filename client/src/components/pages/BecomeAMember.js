import React from "react"
import styles from "./BecomeAMember.module.css"

class BecomeAMember extends React.Component {

    render(){
        return (
            <main className={styles.main}>
                <h1>Bli medlem!</h1>
                <div className={styles.embededForm}>
                    <iframe 
                        src="https://docs.google.com/forms/d/e/1FAIpQLScNCnQSOnjrQ8eroEnJdc5WCg8uIkPePjnQX1NehdmxyBT-kQ/viewform?embedded=true"
                        allowFullScreen frameBorder="0">
                            Laster inn …
                    </iframe>
                </div>
            </main>
        )
    }
}

export default BecomeAMember