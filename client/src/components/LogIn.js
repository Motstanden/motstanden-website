import React from "react"
import axios from "axios"
import styles from "./LogIn.module.css"

class LogIn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            response: "",
            submitDisabled: false,
            loginWasSuccess: null,
            logoutWasSuccess: null
        }
    }

    // When there a change in the form update the state
    onInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value
        });
    }    

    onSubmit = (event) => {
        event.preventDefault();

        this.setState({
            response: ""
        })
        this.props.onLoginClick()
        this.validateLoginCredentials()
    }

    validateLoginCredentials = () => {

        // Prevent the user from spaming the submit button, and apply waiting styling
        this.setState({
            submitDisabled: true,
            loginWasSuccess: null
        })

        axios.post("/api/login", {

            username: this.state.username,
            password: this.state.password  
        })
        .then( res => {
            let response = res.data.message
            this.setState( {
                response: response,
                loginWasSuccess: true,
            })
        })
        .catch( (err) => {
            let errorMessage = "Fikk ikke kontakt med serveren. prøv igjen senere"
            if(err.response){
                if (err.response.status === 400) { // Bad request
                    errorMessage = "Serveren avviste forespørselen"
                }
                if(err.response.status === 401){ // Unauthorized
                    errorMessage = "Brukernavn eller passord er feil"
                }
            }            
            this.setState( {
                response: errorMessage,
                loginWasSuccess: false
            })
        })
        .finally( () => {
            this.props.onLoginRequestCompleted()
            this.setState({
                submitDisabled: false
            })
        })
    }

    onLogOutClick = () => {
        axios.post("/api/logout")
            .then( res => {
                window.location.href = "/"
                alert("Du er logget ut av motstanden.no")
            })
            .catch( err => {
                console.log(err)
                let errorMsg = "Noe gikk galt ved uloggingen. Prøv igjen senere."
                if(err?.response?.status){
                    errorMsg += `Feilkode: ${err.response.state}` 
                }
                this.setState({
                    response: errorMsg,
                    loginWasSuccess: false
                })
            })
    }

    render(){

        let disabledStyle
        if(this.state.submitDisabled){
            disabledStyle = styles.disabledLoginButton
        }

        let loginAttemptStyle
        let responseTextStyle
        if(this.state.loginWasSuccess != null)
        {
            loginAttemptStyle = this.state.loginWasSuccess ? styles.loginSuccessStyle : styles.loginFailedStyle
            responseTextStyle = this.state.loginWasSuccess ? styles.green : styles.red
        }

        return(
            <div className={styles.logInStyles}>
                <form onSubmit={this.onSubmit} className={styles.formStyle}>
                    <label htmlFor="username"><b>Brukernavn:</b></label> 
                    <br/>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Brukernavn..."
                        required
                        autoFocus
                        autoComplete = "off"
                        value={this.state.username} 
                        onChange={this.onInputChange}
                        disabled={this.state.submitDisabled}
                        className={loginAttemptStyle}
                        
                        >
                    </input>
                    <br/>
                    <label htmlFor="password"><b>Passord:</b></label> <br/>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Passord..."
                        required
                        value={this.state.password} 
                        onChange={this.onInputChange}
                        disabled={this.state.submitDisabled}
                        className={loginAttemptStyle}
                    ></input><br/>
                    <div className={styles.buttonDiv}>
                        <input className={styles.logInButton + " " + disabledStyle}
                            type="submit" 
                            value="Logg inn"
                            disabled = {this.state.submitDisabled}
                            >
                        </input>
                        <input className={styles.logInButton + " " + disabledStyle}
                            type="button" 
                            value="Logg ut"
                            disabled = {this.state.submitDisabled}
                            onClick = {this.onLogOutClick}
                            >
                        </input>
                        <p className={styles.responseText + " " + responseTextStyle}>{this.state.response}</p>
                    </div>
                </form> 
            </div>
        )
    }
}

export default LogIn

