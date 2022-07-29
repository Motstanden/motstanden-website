import React from "react"
import { useAuth } from "../../context/Authentication"


export default function Home(){
    let auth = useAuth()
    return (
        <>
            <h1>Hjem</h1>
            <p>Velkommen {auth.user}</p>
        </>
    )
}
