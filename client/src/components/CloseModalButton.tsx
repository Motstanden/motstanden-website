import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";


export function CloseModalButton({
    onClick,
    style,
}: {
    onClick?: React.MouseEventHandler<HTMLButtonElement> 
    style?: React.CSSProperties
}) {
    return (
        <IconButton
            onClick={onClick}
            style={{
                ...style
            }}
            sx={{
                bgcolor: "rgba(128, 128, 128, 0.2)",
                "&:hover": {
                    bgcolor: "rgba(128, 128, 128, 0.4)",
                },
            }}
        >
            <CloseIcon />
        </IconButton>
    )
}