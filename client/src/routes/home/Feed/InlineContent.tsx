import { Box, Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export function InlineContent({
    children,
    title,
    href,
    icon,
    style
}: {
    children?: React.ReactNode
    title?: string
    href?: string
    icon?: React.ReactNode,
    style?: React.CSSProperties
}) {

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "30px 1fr",
            columnGap: "5px",
            rowGap: "5px",
            ...style
        }}>
            <span style={{
                justifySelf: "center",
                alignSelf: "center",
                gridRow: "1",
            }}>
                {icon}
            </span>
            <Header 
                title={title} 
                href={href} 
                style={{
                    gridRow: "1",
                    gridColumn: "2",
                    alignSelf: "center",
                }} />
            <Box sx={{
                backgroundColor: theme => theme.palette.divider,
                width: "2px",
                justifySelf: "center",
                gridRow: "2"
            }}/>
            <div style={{
                gridRow: "2",
            }}>
                {children}     
            </div>
        </div>
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