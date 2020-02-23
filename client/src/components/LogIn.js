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

        if(this.state.username && this.state.password){
            this.setState({
                response: ""
            })
            this.props.onLoginClick()
            this.validateLoginCredentials()
        }
        else {
            this.setState({
                response: "Alle feltene må fylles ut"
            })
        }
    }

    validateLoginCredentials = () => {

        axios.post("/api/login", {
            username: this.state.username,
            password: this.state.password           
        })
        .then( res => {

            localStorage.setItem("accessToken", res.data.accessToken)

            this.setState( {
                response: res.data.message
            })
        })
        .catch( (err) => {
            let errorMessage = "Fikk ikke kontakt med serveren. prøv igjen senere"
            if(err.response){
                console.log(err.response) // 400 "Bad request"
                if (err.response.status === 400) {
                    errorMessage = "Serveren avviste forespørselen"
                }
                if(err.response.status === 401){
                    errorMessage = "Brukernavn eller passord er feil"
                }
            }            
            console.log("Error: ", err)
            this.setState( {
                response: errorMessage
            })
        })
        .finally( () => {
            this.props.onLoginRequestCompleted()
        })
    }

    render(){
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
                        value={this.state.username} 
                        onChange={this.onInputChange}
                        >
                    </input>
                    <br/>
                    <label htmlFor="password"><b>Passord:</b></label> <br/>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Passord..."
                        value={this.state.password} 
                        onChange={this.onInputChange}
                    ></input><br/>
                    <div className={styles.buttonDiv}>
                        <input className={styles.logInButton}
                            type="submit" 
                            value="Logg inn"
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

