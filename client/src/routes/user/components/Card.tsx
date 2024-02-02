import { Grid, Stack } from "@mui/material";
import { ResponsiveTitleCard, TitleCardProps } from "src/components/TitleCard";

export function Card({
    title,
    children,
    spacing
}:
    TitleCardProps & {
        spacing?: number
    }) {
    return (
        <ResponsiveTitleCard title={title} sx={{ height: "100%" }}>
            <Stack spacing={spacing ?? 2}>
                {children}
            </Stack>
        </ResponsiveTitleCard>
    )
}

export function CardTextItem({ label, text }: { label: string, text: string }) {
    return (
        <Grid container>
            <Grid item xs={3} sm={12} md={3} >
                <b>{label}</b>
            </Grid>
            <Grid item xs={9} sm={12} md={9}>
                {text}
            </Grid>
        </Grid>
    )
}