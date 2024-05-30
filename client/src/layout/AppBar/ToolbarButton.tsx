import { Avatar, IconButton, SxProps, Tooltip } from "@mui/material"
import { useAppBarIconSize } from "../useAppSizes"

export function ToolbarButton({
    tooltip,
    onClick,
    sx,
    children,
}: {
    tooltip: string,
    onClick?: VoidFunction,
    sx?: SxProps
    children?: React.ReactNode
}) {
    const { buttonSize } = useAppBarIconSize()

    return (
        <IconButton 
            onClick={onClick}
            sx={{
                p: "0px",
                color: "inherit",
                bgcolor: "#FFFFFF15",
                ":hover": {
                    bgcolor: "#FFFFFF30",
                },
                ...sx
            }}>
            <Tooltip title={tooltip}>
                <Avatar 
                    variant='circular'
                    sx={{
                        height: buttonSize,
                        width: buttonSize, 
                        bgcolor: "transparent"
                    }}
                    >
                        {children}
                </Avatar>
            </Tooltip>
        </IconButton>
    )
}