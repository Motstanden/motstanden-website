import { Divider, Grid, Paper, SxProps } from "@mui/material";

export type TitleCardProps = {
    title: string,
    children: React.ReactNode,
    sx?: SxProps,
    paddingTop?: number
}

export function TitleCard({ title, sx, children, paddingTop }: TitleCardProps) {
    return (
        <Paper sx={{ p: 2, ...sx }} elevation={6}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <Divider sx={{ mt: 1.5, mb: paddingTop ?? 2 }} />
            {children}
        </Paper>
    )
}

export function ResponsiveTitleCard(props: TitleCardProps) {
    const { children, ...titleCardProps } = props

    return (
        <Grid item xs={12} sm={6}>
            <TitleCard {...titleCardProps}>
                {children}
            </TitleCard>
        </Grid>
    )
}