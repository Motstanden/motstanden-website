import React from "react"
import { Link } from "react-router-dom"

export function UrlList( { children }: {children: React.ReactNode}) {
    return (
        <ul style={{
            listStyleType: "none",
        }}>
            {children}
        </ul>
    )
}

export function UrlListItem( {to, text}: {to: string, text: string}){
    return (
        <li>
            <Link to={to}>{text}</Link>
        </li>
    )
}