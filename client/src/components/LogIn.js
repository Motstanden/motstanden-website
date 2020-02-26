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
            loginWasSuccess: null
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

            localStorage.setItem("accessToken", res.data.accessToken)

            this.setState( {
                response: res.data.message,
                loginWasSuccess: true
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

    render(){

        let disabledStyle
        if(this.state.submitDisabled){
            disabledStyle = styles.disabledLoginButton
        }

        let loginAttemptStyle
        if(this.state.loginWasSuccess != null)
        {
            loginAttemptStyle = this.state.loginWasSuccess ? styles.loginSuccessStyle : styles.loginFailedStyle
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
                        <p className={styles.responseText}>{this.state.response}</p>
                    </div>
                </form> 
            </div>
        )
    }
}

export default LogIn

