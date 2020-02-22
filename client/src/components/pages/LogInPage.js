import React from "react"
import styles from "./LogInPage.module.css"

import LogIn from "./../LogIn.js"

import avatarGirl from "./../../images/avatar_girl.png"
import avatarBoy from "./../../images/avatar_boy.png"

class LogInPage extends React.Component{
    render() {
        return(
            <main className={styles.grid}>
                
                <h1>Logg inn</h1>
                <img src={avatarBoy} className={styles.avatarImage}></img>
                <LogIn/>
                
            </main>
        )
    }
}


export default LogInPage
