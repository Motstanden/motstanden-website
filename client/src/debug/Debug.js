import React from "react"
import axios from "axios"


class Debug extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            apiResponse: "Waiting for api....",
            dbResponse: "Waiting for database...",
            loginCheckResponse: ""
        }

        axios.get("/api/ping")
            .then( (res) => {
                this.setState({
                    apiResponse: res.data.apiResponse,
                    dbResponse: res.data.dbResponse
                })
            })
            .catch( (error) => {
                console.log(error)
            })
    }

    onLoginCheckClick = () => {      

        const accessToken = localStorage.getItem("accessToken")
        const config = {
            headers: {'Authorization': "Bearer " +  accessToken}
        }
       
        axios.get("/api/protected", config)
            .then( res => {
                console.log(res)
                this.setState({
                    loginCheckResponse: res.data.message
                })
            })
            .catch( (err) => {
                let errorMessage = "Failed to connect to api"
                if(err.response){
                    errorMessage = err.response.statusText
                }            
                console.log("Error: ", err)
                this.setState( {
                    loginCheckResponse: errorMessage
                })
            })
    }

    render(){
        return(
            <main style={{padding: "0px 1% 10px 1%"}}>
                <h1>Debug</h1> 
                <h2>Ping the backend</h2>
                <p><b>Api:</b> {this.state.apiResponse}</p>
                <p><b>Database:</b> {this.state.dbResponse}</p>
                <hr/>
                <h2>Check authentication</h2>
                <p><button onClick={this.onLoginCheckClick}>Check if logged in</button></p>
                <p><b>Login check response:</b> {this.state.loginCheckResponse}</p>
            </main>
        )
    }   
}

export default Debug