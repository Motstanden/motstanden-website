import React, { useEffect } from "react"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"


export default function Home(){
    let auth = useAuth()
    useTitle("Hjem")
    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p>Velkommen {auth.user}!</p>
            <p>Her kommer det forhåpentligvis noe kult i fremtiden...</p>
        </PageContainer>
    )
}
