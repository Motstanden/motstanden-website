import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

import React from "react";
import { IconPopupMenu } from "src/components/menu/IconPopupMenu";

export function EditOrDeleteMenu({
    onEditClick,
    onDeleteClick,
    iconOrientation,
    disabled,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose,
    ariaLabel
}: {
    onEditClick: React.MouseEventHandler<HTMLLIElement>,
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>,
    iconOrientation?: "horizontal" | "vertical",
    disabled?: boolean,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
    ariaLabel?: string
}) {
    return (
        <IconPopupMenu
            icon={iconOrientation === "vertical" ? <MoreVertIcon/> : <MoreHorizIcon/>}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            disabled={disabled}
            ariaLabel={ariaLabel}
        >
            <EditMenuItem onClick={onEditClick} divider={true} />
            <DeleteMenuItem onClick={onDeleteClick} />
        </IconPopupMenu>
    );
}

export function EditMenuItem({ 
    onClick,
    divider 
}: { 
    onClick?: React.MouseEventHandler<HTMLLIElement>,
    divider?: boolean
}) {
    return (
        <MenuItem 
            style={{ minHeight: "50px", minWidth: "180px" }} 
            divider={divider} 
            onClick={onClick} >
            <ListItemIcon>
                <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                Rediger
            </ListItemText>
        </MenuItem>
    )
}


export function DeleteMenuItem({ 
    onClick,
    divider 
}: { 
    onClick?: React.MouseEventHandler<HTMLLIElement>,
    divider?: boolean
}) {
    return (
        <MenuItem
            onClick={onClick} 
            divider={divider} 
            style={{ minHeight: "50px", minWidth: "180px" }} 
            sx={{ backgroundColor: "error"}}>
            <ListItemIcon>
                <DeleteForeverIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: "error" }}>
                Slett
            </ListItemText>
        </MenuItem>
    )
}