import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

import React from "react";
import { IconPopupMenu, IconSize } from "src/components/menu/IconPopupMenu";

export function EditOrDeleteMenu({
    onEditClick,
    onDeleteClick,
    iconOrientation,
    disabled,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose,
    ariaLabel,
    style,
    size
}: {
    onEditClick: React.MouseEventHandler<HTMLLIElement>,
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>,
    iconOrientation?: "horizontal" | "vertical",
    disabled?: boolean,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
    ariaLabel?: string,
    style?: React.CSSProperties,
    size?: IconSize,    
}) {
    return (
        <IconPopupMenu
            style={style}
            icon={iconOrientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon fontSize={size}/>}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            disabled={disabled}
            ariaLabel={ariaLabel}
            size={size}
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
