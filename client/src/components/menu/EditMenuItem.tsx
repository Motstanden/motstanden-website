import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import React from "react";


export function EditMenuItem({
    onClick, divider, text
}: {
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    divider?: boolean;
    text?: string;
}) {
    return (
        <MenuItem
            style={{ minHeight: "50px", minWidth: "180px" }}
            divider={divider}
            onClick={onClick}>
            <ListItemIcon>
                <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                {text ?? "Rediger"}
            </ListItemText>
        </MenuItem>
    );
}
