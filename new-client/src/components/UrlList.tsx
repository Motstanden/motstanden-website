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

export function UrlListItem( {to, text, type, reloadDocument}: {to: string, text: string, type?: string | undefined, reloadDocument?: boolean | undefined}){
    return (
        <li>
            <Link to={to} type={type} reloadDocument={reloadDocument} >{text}</Link>
        </li>
    )
}