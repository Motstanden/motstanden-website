import React from "react"
import styles from "./LogInPopup.module.css"

class LogInPopup extends React.Component{
    render() {
        return(
            <div>
                <button className={styles.loginButton} to="/">LOGG INN</button>
            </div>
        )
    }
}


export default LogInPopup