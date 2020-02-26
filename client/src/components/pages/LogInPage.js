import React from "react"
import ReactDOM from "react-dom"
import styles from "./LogInPage.module.css"
import LogIn from "./../LogIn.js"

import avatarGirl from "./../../images/login_avatar/avatar_girl.png"
import avatarGirlAnim1 from "./../../images/login_avatar/avatarGirlLoading1.png"
import avatarGirlAnim2 from "./../../images/login_avatar/avatarGirlLoading2.png"

import avatarBoy from "./../../images/login_avatar/avatar_boy.png"
import avatarBoyAnim1 from "./../../images/login_avatar/avatarBoyLoading1.png"
import avatarBoyAnim2 from "./../../images/login_avatar/avatarBoyLoading2.png"


const avatarArray = [
    avatarGirl,
    avatarGirlAnim1,
    avatarGirlAnim2,
    avatarBoy,
    avatarBoyAnim1,
    avatarBoyAnim2,
]

class LogInPage extends React.Component{
    constructor(props){
        super(props)

        // Randomly chooses what gender the avatar should have
        let avatarGender;
        let avatarIndex;
        if(Math.random() < 0.5 ){
            avatarGender = "girl"
            avatarIndex = 0
        }
        else {
            avatarGender = "boy"
            avatarIndex = 3
        }

        this.state = {
            avatarGender: avatarGender,
            avatarIndex: avatarIndex,
            animmationHandler: null
        }
    }

    startAnimation = () => {
        this.setState({
            animmationHandler: setInterval(this.toggleImage, 200)
        })
    }

    endAnimation = () => {
        clearInterval(this.state.animmationHandler)
        this.setState({
            animmationHandler: null
        })
        this.resetImage()
    }

    toggleImage = () => {
        let newIndex
        if(this.state.avatarGender === "girl"){
            newIndex = this.state.avatarIndex === 2 ? 1 : this.state.avatarIndex + 1
        }
        else {
            newIndex = this.state.avatarIndex === 5 ? 4 : this.state.avatarIndex + 1
        }

        // If states are set consecutively too quickly, react will optimize and batch all the state changes together before rendering.
        // unstable_batchedUpdates will force React to render the state change immediately.
        ReactDOM.unstable_batchedUpdates( () => {
            this.setState({
                avatarIndex: newIndex
            })
        })
    }

    resetImage = () => {
        let initIndex = this.state.avatarGender === "girl" ? 0 : 3
        this.setState({
            avatarIndex: initIndex
        })
    }

    render() {
        return(
            <main >
                <div className={styles.grid}>
                    <h1>Logg inn</h1>
                    <img 
                        src={avatarArray[this.state.avatarIndex]} 
                        className={styles.avatarImage}
                        alt="Person kledd i Motstanden-uniform"
                        >
                    </img>
                    <LogIn 
                        className={styles.loginComponent}
                        onLoginClick={this.startAnimation} 
                        onLoginRequestCompleted={this.endAnimation}
                    />
                </div>
            </main>
        )
    }
}


export default LogInPage
