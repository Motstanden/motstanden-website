import { Avatar, IconButton, SxProps, Tooltip } from "@mui/material"
import { useAppBarIconSize } from "../useAppSizes"

export const toolbarButtonSx: SxProps = {
    p: "0px",
    color: "inherit",
    bgcolor: "#FFFFFF15",
    ":hover": {
        bgcolor: "#FFFFFF30",
    },
}

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
    const buttonStyle: SxProps = { ...toolbarButtonSx, ...sx } as SxProps     // I have no idea why ts demands this type assertion...
    
    return (
        <IconButton 
            onClick={onClick}
            sx={buttonStyle}
        >
            <ToolbarButtonIcon tooltip={tooltip}>
                {children}
            </ToolbarButtonIcon>
        </IconButton>
    )
}

export function ToolbarButtonIcon({
    tooltip,
    children,
}: {
    tooltip: string
    children?: React.ReactNode
}) {
    const { buttonSize } = useAppBarIconSize()

    return (
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
    )
}