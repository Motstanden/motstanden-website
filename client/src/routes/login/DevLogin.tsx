import { Button } from "@mui/material";

export default function DevLogin(props: DevLoginProps) {
    return import.meta.env.VITE_ENABLE_DEV_LOGIN === "true" ? <DevLoginBtn props={props} /> : <></>
}

function DevLoginBtn({ props }: { props: DevLoginProps }) {
    const onClick = async () => {

        const res = await fetch("/api/dev/auth/login", {
            method: `POST`,
            body: JSON.stringify({
                destination: props.email.toLowerCase().trim(),
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (res.ok) {
            window.location.reload()
        }
    }

    return (
        <div style={{marginTop: "35px"}}> 
            <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={onClick}
                sx={{ width: "172px" }}
            >
                Dev logg inn
            </Button>
        </div>
    )
}

interface DevLoginProps {
    email: string
}