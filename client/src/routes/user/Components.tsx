import { Divider, Grid, Paper, Stack } from "@mui/material"

export function Card({
    title, 
    children, 
    spacing
}: {
    title: string, 
    children: React.ReactNode,
    spacing?: number
}){
    return (
        <Grid item xs={12} sm={6}>
            <Paper sx={{p: 2, height: "100%"}} elevation={6}>
                <h3 style={{margin: 0}}>{title}</h3>
                <Divider sx={{mt: 2, mb:2}}/>
                <Stack spacing={spacing ?? 2}>
                    {children}
                </Stack>
            </Paper>
        </Grid>
    )    
}

export function CardTextItem( { label, text }: {label: string, text: string}) {
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
