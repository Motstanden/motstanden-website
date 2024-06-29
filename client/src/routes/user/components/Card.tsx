import EditIcon from "@mui/icons-material/Edit"
import { Grid, IconButton, Stack, SxProps, Tooltip } from "@mui/material"
import { TitleCard } from "src/components/TitleCard"

export function Card({
    title,
    children,
    spacing,
    showEditButton,
    onEditClick,
    editButtonToolTip
}:{
    title: string,
    spacing?: number
    children: React.ReactNode,
    showEditButton?: boolean
    onEditClick?: () => void
    editButtonToolTip?: string
}) {
    return (
        <Grid item xs={12} md={6}>
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
                    height: "100%" 
                }}
                >
                <Stack spacing={spacing ?? 2}>
                    {children}
                </Stack>
            </TitleCard>
        </Grid>
    )
}

export function CardTextList( { children }: { children: React.ReactNode }) { 
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "20px",
            rowGap: "18px",
        }}>
            {children}
        </div>
    
    )
}

export function CardTextItem({ label, text }: { label: string, text: string }) {
    return (
        <>
            <div style={{whiteSpace: "nowrap" }}>
                <b>{label}</b>
            </div>
            <div>
                <span style={{ overflowWrap: "anywhere"}}>
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
