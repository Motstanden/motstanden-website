import React from "react"
import axios from "axios"


class Ping extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            apiResponse: "Waiting for api....",
            dbResponse: "Waiting for database..."
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

    render(){
        return(
            <main style={{padding: "0px 1% 10px 1%"}}>
                <h1>Response from the server:</h1> 
                <p><b>Api:</b> {this.state.apiResponse}</p>
                <p><b>Database:</b> {this.state.dbResponse}</p>
            </main>
        )
    }   
}

export default Ping