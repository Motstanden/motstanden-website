import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useAppBarIconSize } from "../useAppSizes";

export function SettingsButton({
    onClick,
}: {
    onClick?: VoidFunction
}) {
    const { buttonSize, iconFontSize } = useAppBarIconSize()

    return (
        <IconButton 
            onClick={onClick}
            sx={{
                p: "0px",
                color: "inherit",
                bgcolor: "#FFFFFF15",
                ":hover": {
                    bgcolor: "#FFFFFF30",
                }
            }}>
            <Tooltip title="Innstillinger">
                <Avatar 
                    variant='circular'
                    sx={{
                        height: buttonSize,
                        width: buttonSize, 
                        bgcolor: "transparent"
                    }}
                    >
                    <SettingsIcon 
                        fontSize={iconFontSize}
                        sx={{
                            color: "primary.contrastText",
                        }}/>
                </Avatar>
            </Tooltip>
        </IconButton>
    )
}