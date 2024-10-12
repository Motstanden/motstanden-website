import { Paper } from "@mui/material"
import { InlineContent } from "./InlineContent"

export function InlinePaper({
    children,
    title,
    href,
    icon
}: {
    children?: React.ReactNode
    title?: string
    href?: string
    icon?: React.ReactNode
}) {

    return (
        <Paper
            sx={{
                py: 2,
                px: 1,
                borderRadius: "7px",
            }}
            variant="outlined"
        >
            <InlineContent 
                title={title} 
                href={href} 
                icon={icon}
            >
                {children}     
            </InlineContent>
        </Paper>
    )
}