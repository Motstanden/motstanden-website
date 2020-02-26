import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import App from "./App.js"



// When in development we want to send requests to port 5000 from port 3000 with the axios library
const clientUrl = window.location.origin
const devUrl = "http://localhost:3000"
if(clientUrl === devUrl){
    axios.defaults.baseURL = "http://localhost:5000/"
}
else {
    axios.defaults.withCredentials = true
}



ReactDOM.render(<App/>, document.getElementById("root"))