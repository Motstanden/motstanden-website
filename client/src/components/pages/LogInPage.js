import React from "react"
import styles from "./LogInPage.module.css"

import LogIn from "./../LogIn.js"

import avatarGirl from "./../../images/login_avatar/avatar_girl.png"
import avatarGirlAnim1 from "./../../images/login_avatar/avatarGirlLoading1.png"
import avatarGirlAnim2 from "./../../images/login_avatar/avatarGirlLoading2.png"

import avatarBoy from "./../../images/login_avatar/avatar_boy.png"
import avatarBoyAnim1 from "./../../images/login_avatar/avatarBoyLoading1.png"
import avatarBoyAnim2 from "./../../images/login_avatar/avatarBoyLoading2.png"

class LogInPage extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            loadedImage: avatarGirl
        }
    }

    startAnimation = () => {
        this.setState({
            loadedImage: avatarGirlAnim1
        })
        console.log("Sart animation")
    }

    endAnimation = () => {
        this.setState({
            loadedImage: avatarGirl
        })
        console.log("Stop animation")

    }

    render() {
        return(
            <main className={styles.grid}>
                
                <h1>Logg inn</h1>
                <img src={this.state.loadedImage} className={styles.avatarImage} ></img>
                <LogIn onLoginClick={this.startAnimation} onLoginRequestCompleted={this.endAnimation}/>
                
            </main>
        )
    }
}


export default LogInPage
