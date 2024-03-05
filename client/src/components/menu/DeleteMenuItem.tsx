import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import React from "react";


export function DeleteMenuItem({
    onClick, divider, text,
}: {
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    divider?: boolean;
    text?: string;
}) {
    return (
        <MenuItem
            onClick={onClick}
            divider={divider}
            style={{ minHeight: "50px", minWidth: "180px" }}
            sx={{ backgroundColor: "error" }}>
            <ListItemIcon>
                <DeleteForeverIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: "error" }}>
                {text ?? "Slett"}
            </ListItemText>
        </MenuItem>
    );
}
