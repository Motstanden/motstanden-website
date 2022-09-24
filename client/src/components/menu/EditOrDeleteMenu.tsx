import React from "react";
import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconPopupMenu } from "src/components/menu/IconPopupMenu";

export function EditOrDeleteMenu({
    onEditClick, 
    onDeleteClick, 
    iconOrientation,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose
}: {
    onEditClick: React.MouseEventHandler<HTMLLIElement>,
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>,
    iconOrientation?: "horizontal" | "vertical",
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
}) {
    return (
        <IconPopupMenu 
            icon={iconOrientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon />} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
        >
            <MenuItem style={{ minHeight: "50px", minWidth: "180px" }} divider={true} onClick={onEditClick} >
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                    Rediger
                </ListItemText>
            </MenuItem>
            <MenuItem style={{ minHeight: "50px" }} sx={{ backgroundColor: "error" }} onClick={onDeleteClick}>
                <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ color: "error" }}>
                    Slett
                </ListItemText>
            </MenuItem>
        </IconPopupMenu>
    );
}
