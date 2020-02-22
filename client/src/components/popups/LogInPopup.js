import React from "react"
import styles from "./LogInPopup.module.css"
import Backdrop from "../sidebar/Backdrop.js"
import LogInPage from "../pages/LogInPage.js"


class LogInPopup extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            popupIsVisible: false
        }
    }

    loginButtonClick = () => {
        this.setState({popupIsVisible: true})
    }

    backdropClick = () => {
        this.setState({popupIsVisible: false})
    }

    render() {

        let backdrop
        let login
        let popupIsVisible = this.state.popupIsVisible
        

        if(popupIsVisible){
            backdrop = <Backdrop onClick={this.backdropClick}/>
            login = <LogInPage/>
        }

      

        return(
            <div>
                {backdrop}
                <button className={styles.loginButton} onClick={this.loginButtonClick}>LOGG INN</button>
                <div className={styles.logInPopup}>
                        {login}
                </div>
                
                
            </div>
        )
    }
}


export default LogInPopup