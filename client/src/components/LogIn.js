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
        this.setState({
            response: "",
        })

        this.props.onLoginClick()
        this.validateLoginCredentials()
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
            let errorMessage = "Failed to connect to api"
            if(err.response){
                errorMessage = err.response.statusText
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
            <div className={styles.main}>
                <form className={styles.form} onSubmit={this.onSubmit}>
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
                    </div>
                    
                </form> 
                <h3>{this.state.response}</h3>
                <h3>{this.state.secretResponse}</h3>
            </div>
        )
    }
}

export default LogIn

