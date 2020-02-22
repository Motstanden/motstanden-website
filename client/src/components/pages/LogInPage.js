import React from "react"
import styles from "./LogInPage.module.css"

import LogIn from "./../LogIn.js"

import avatarGirl from "./../../images/avatar_girl.png"
import avatarBoy from "./../../images/avatar_boy.png"

class LogInPage extends React.Component{

    startAnimation = () => {
        console.log("Sart animation")
    }

    endAnimation = () => {
        console.log("Stop animation")

    }

    render() {
        return(
            <main className={styles.grid}>
                
                <h1>Logg inn</h1>
                <img src={avatarBoy} className={styles.avatarImage} ></img>
                <LogIn onLoginClick={this.startAnimation} onLoginRequestCompleted={this.endAnimation}/>
                
            </main>
        )
    }
}


export default LogInPage
