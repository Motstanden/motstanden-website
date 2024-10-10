import { Paper, Link, Box } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

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
            <div style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr",
                columnGap: "5px",
                rowGap: "5px",
            }}>
                <span style={{
                    justifySelf: "center",
                    alignSelf: "center",
                }}>
                    {icon}
                </span>
                <Header 
                    title={title} 
                    href={href} 
                    style={{
                        gridColumn: icon === undefined ? "1 / span 2" : "2",
                        alignSelf: "center",
                    }} />
                <Box sx={{
                    backgroundColor: theme => theme.palette.divider,
                    width: "3px",
                    borderRadius: "2px",
                    justifySelf: "center",
                    gridRow: "2"
                }}/>
                <div style={{
                    gridRow: "2",
                }}>
                    {children}     
                </div>
            </div>
        </Paper>
    )
}

function Header( { title, href, style: styleOverride }: { title?: string, href?: string, style?: React.CSSProperties }) { 
    
    const style = {
        fontWeight: "bold",
        fontSize: "small",
        opacity: 0.8,
        color: "inherit",
        ...styleOverride,
    }

    if(title === undefined)
        return <></>

    if(href === undefined) {
        return (
             <span style={style}>
                 {title}
             </span>
        )
    }

    return (
        <Link
            component={RouterLink}
            to={href}
            underline="hover"
            sx={style}
        >
            {title}
        </Link>
    )
    
}