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