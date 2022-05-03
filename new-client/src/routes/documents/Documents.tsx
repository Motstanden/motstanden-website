import React from "react"
import { useQuery } from "react-query"

export default function Documents(){
    
    
    
    return (
        <>
            <h1>Dokumenter</h1>
            <DocumentList/>
        </>
    )
}

interface DocItem {
    title: string,
    url: string
}

function DocumentList(){

    // Fetch documents from server
    const {status, error, data} = useQuery(["FetchDocuments"], async () => {
        const response = await fetch("/api/documents")
        if(!response.ok){
            throw new Error(`${response.status}: ${response.statusText}`)
        }
        return response.json()
    })

    if (status === 'loading') {
        return <div>Loading...</div>
    }
    
    if (status === 'error') {
        let msg: string = error instanceof Error ? error.message : `${error}`
        return <div>Error: {msg}</div>
    }

    return (
        <ul>
            { data.map( (doc: DocItem): JSX.Element => (
                <li key={doc.title}>
                    <a href={window.location.origin + '/' + doc.url} 
                       type="application/pdf">
                        {doc.title}
                    </a>
                </li>  
            ))
            }
        </ul>
    ) 
}