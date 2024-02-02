import { Link, Skeleton } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export function UrlList({ children }: { children?: React.ReactNode }) {
    return (
        <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "larger"
        }}>
            {children}
        </ul>
    )
}

export function UrlListItem({ 
    to, 
    text, 
    type, 
    reloadDocument,
    externalRoute
}: { 
    to: string, 
    text: string, 
    type?: string | undefined, 
    reloadDocument?: boolean | undefined,
    externalRoute?: boolean | undefined
}) {
    const urlAttribute = externalRoute ? { href: to } : { to: to, reloadDocument: reloadDocument }
    return (
        <li style={{
            marginBottom: "20px"
        }}>
            <Link
                component={externalRoute ? "a" : RouterLink}
                {...urlAttribute}
                type={type}
                underline="hover"
                color="secondary"
            >
                {text}
            </Link>
        </li>
    )
}

export function UrlListSkeleton( {length}: { length: number }) {
    return (
        <UrlList>
            {Array(length).fill(1).map((_, index) => (
                <li 
                    key={index} 
                    style={{
                        marginBottom: "12.5px"
                    }}>
                    <Skeleton 
                        variant="text"
                        style={{fontSize: "x-large"}}
                        width="200px"
                    />
                </li>
            ))}
        </UrlList>
    )
}