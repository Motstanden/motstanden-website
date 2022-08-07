export const headerStyle = {
    backgroundColor: "primary.main",
    "& th": {
        fontSize: 14, 
        fontWeight: "bold", 
        textTransform: "uppercase", 
        color: "primary.contrastText"}
}

export const rowStyle = {
    // Alternating background color
    '&:nth-of-type(odd)': {
        backgroundColor: "action.hover",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}

export const linkStyle = {
    color: "secondary.light",
    "&:visited": {
        color: "secondary.dark"
    },
    "&:hover": {
        color: "secondary.main"
    },
}