import { Button } from "@mui/material";

export function LikeButton({
    style
}:{
    style?: React.CSSProperties
}) {
    return (
        <Button
            color="secondary"
            variant="text"
            style={{
                padding: "0px",
                margin: "0px",
                ...style
            }}
            sx={{
                bgcolor: "transparent",
                "&:hover": {
                    bgcolor: "transparent",
                },
                color: (theme) => theme.palette.text.primary,
            }}
        >
            Lik
        </Button>
    )
}