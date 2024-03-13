import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import React from "react";
import { useAppSnackBar } from 'src/context/AppSnackBar';

export function CopyLinkMenuItem({
    linkValue,
    onClick,
    divider, 
    text,
}: {
    linkValue: (() => string) | string;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    divider?: boolean;
    text?: string;
}) {
    const showSnackbar = useAppSnackBar();

    const onCopyLinkClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const link = typeof linkValue === "function" ? linkValue() : linkValue;
        navigator.clipboard.writeText(link);
        showSnackbar("Kopiert til utklippstavlen")
        onClick?.(e)
    }

    return (
        <MenuItem
            style={{ minHeight: "50px", minWidth: "180px" }}
            divider={divider}
            onClick={onCopyLinkClick}>
            <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                {text ?? "Kopier link"}
            </ListItemText>
        </MenuItem>
    );
}
