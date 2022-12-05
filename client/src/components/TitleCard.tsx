import { SxProps } from "@mui/material/styles"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"

export type TitleCardProps = {
    title: string,
    children: React.ReactNode,
    sx?: SxProps
}

export function TitleCard({ title, sx, children }: TitleCardProps) {
    return (
        <Paper sx={{ p: 2, ...sx }} elevation={6}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <Divider sx={{ mt: 1.5, mb: 2 }} />
            {children}
        </Paper>
    )
}

export function ResponsiveTitleCard({ title, sx, children }: TitleCardProps) {
    return (
        <Grid item xs={12} sm={6}>
            <TitleCard title={title} sx={sx}>
                {children}
            </TitleCard>
        </Grid>
    )
}