import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { SxProps } from '@mui/material';
import React from "react";
import { IconPopupMenu } from "src/components/menu/IconPopupMenu";
import { DeleteMenuItem } from './DeleteMenuItem';
import { EditMenuItem } from './EditMenuItem';

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
    sx
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
    style?: React.CSSProperties,
    sx?: SxProps
}) {
    return (
        <IconPopupMenu
            style={style}
            sx={sx}
            icon={iconOrientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon/>}
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

