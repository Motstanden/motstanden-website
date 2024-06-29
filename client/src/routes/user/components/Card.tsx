import EditIcon from "@mui/icons-material/Edit"
import { IconButton, Stack, SxProps, Tooltip } from "@mui/material"
import { TitleCard } from "src/components/TitleCard"

export type CardVariant = "maximized" | "minimized"

export function Card({
    title,
    children,
    spacing,
    showEditButton,
    onEditClick,
    editButtonToolTip,
    sx,
    stackSx,
    variant
}:{
    title: string,
    spacing?: number
    children: React.ReactNode,
    showEditButton?: boolean
    onEditClick?: () => void
    editButtonToolTip?: string
    sx?: SxProps,
    stackSx?: SxProps
    variant?: CardVariant
}) {
    return (
        <TitleCard 
            title={title} 
            showMenu={showEditButton}
            noMenuMargin
            menu={(
                <EditButton 
                    onClick={onEditClick} 
                    toolTip={editButtonToolTip} 
                    sx={{
                        marginRight: "-9px",
                        marginTop: "2px"
                    }}
                    />
            )}
            sx={{ 
                height: variant === "maximized" ? "100%" : "auto",
                ...sx
            }}
            >
            <Stack spacing={spacing ?? 2} sx={stackSx}>
                {children}
            </Stack>
        </TitleCard>
    )
}

export function CardTextList( { children, style }: { children: React.ReactNode, style?: React.CSSProperties }) { 
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "20px",
            rowGap: "18px",
            ...style
        }}>
            {children}
        </div>
    
    )
}

export function CardTextItem({ 
    label, text, labelStyle, textStyle 
}: { 
    label: string, 
    text: string 
    labelStyle?: React.CSSProperties,
    textStyle?: React.CSSProperties
}) {
    return (
        <>
            <div style={{whiteSpace: "nowrap", ...labelStyle }}>
                <b>{label}</b>
            </div>
            <div>
                <span style={{ overflowWrap: "anywhere", ...textStyle}}>
                    {text}
                </span>
            </div>
        </>
    )
}

function EditButton({ 
    toolTip, onClick, sx
}: { 
    toolTip?: string, 
    onClick?: () => void,
    sx?: SxProps
}) {

    return (
        <Tooltip title={toolTip}>
            <IconButton 
                onClick={onClick} 
                sx={{
                    p: 0.8,
                    ...sx
                }}>
                <EditIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    )
}
