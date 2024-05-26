import { Grid, Stack } from "@mui/material";
import { TitleCard } from "src/components/TitleCard";

export function Card({
    title,
    children,
    spacing
}:{
    title: string,
    spacing?: number
    children: React.ReactNode
}) {
    return (

        <Grid item xs={12} md={6}>
            <TitleCard title={title} sx={{ height: "100%" }}>
                <Stack spacing={spacing ?? 2}>
                    {children}
                </Stack>
            </TitleCard>
        </Grid>
    )
}

export function CardTextItem({ label, text }: { label: string, text: string }) {
    return (
        <Grid container>
            <Grid item xs={3}>
                <b>{label}</b>
            </Grid>
            <Grid item xs={8}>
                <span style={{ overflowWrap: "anywhere"}}>
                    {text}
                </span>
            </Grid>
        </Grid>
    )
}