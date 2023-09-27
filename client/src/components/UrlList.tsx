import { Link } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./UrlList.module.css";
export function UrlList({ children }: { children: React.ReactNode }) {
    return (
        <ul className={styles.UrlList}>
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
    const urlAttribute = externalRoute ? { href: to } : { to: to }
    return (
        <li>
            <Link
                component={externalRoute ? "a" : RouterLink}
                {...urlAttribute}
                type={type}
                reloadDocument={reloadDocument}
            >
                {text}
            </Link>
        </li>
    )
}
