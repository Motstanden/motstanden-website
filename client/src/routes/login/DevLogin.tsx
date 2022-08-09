import Button from "@mui/material/Button";
import React from "react";

export default function DevLogin(props: DevLoginProps) {
    return  process.env.NODE_ENV === "development" ? <DevLoginBtn props={props}/> : <></>
}

function DevLoginBtn({ props }: {props: DevLoginProps}) {
    const onClick = async () => {
        
        const res = await fetch("/api/dev/login", {
            method: `POST`,
            body: JSON.stringify({
                destination: props.email.toLowerCase().trim(),
            }),
                headers: { 'Content-Type': 'application/json' }
            })
        if(res.ok){
            window.location.reload()
        }
    }

    return (
        <>
            <br/>
            <br/>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={onClick}
                sx={{width: "172px"}}
            >
                Dev logg inn
            </Button>
        </>
    )
}

interface DevLoginProps {
    email: string
}