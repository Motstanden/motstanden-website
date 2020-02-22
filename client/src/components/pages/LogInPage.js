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
            loadedImage: avatarGirl,
            isLoading: false
        }
    }

    startAnimation = () => {
        this.setState({
            isLoading: true
        })
        console.log("Sart animation")
    }

    endAnimation = () => {
        // this.setState({
        //     loadedImage: avatarGirl,
        //     isLoading: false
        // })
        console.log("Stop animation")
    }

    render() {

        if(this.state.isLoading) {
            setTimeout( () => {
                this.setState({
                    loadedImage: avatarGirlAnim1
                })
                setTimeout( () => {
                    this.setState({
                        loadedImage:avatarGirlAnim2
                    }) 
                },200)
            }, 200)
            setTimeout( () => {
                this.setState({
                    loadedImage: avatarGirl,
                    isLoading: false
                })
            }, 1000)
        }

        return(
            <main >
                <div className={styles.grid}>
                    <h1>Logg inn</h1>
                    <img src={this.state.loadedImage} className={styles.avatarImage} ></img>
                    <LogIn onLoginClick={this.startAnimation} onLoginRequestCompleted={this.endAnimation}/>
                </div>
            </main>
        )
    }
}


export default LogInPage
