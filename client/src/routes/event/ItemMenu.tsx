import React from "react";
import { IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EventData } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconPopupMenu } from "src/components/IconPopupMenu";
import { useAuth } from "src/context/Authentication";
import { UserGroup } from "common/enums";
import { buildEventItemUrl } from "./Context";
import { deleteEvent } from "./EventList";


export function ItemMenu({ event, iconOrientation }: { event: EventData; iconOrientation?: "horizontal" | "vertical"; }) {
    const user = useAuth().user!;
    const navigate = useNavigate();

    const onEditClick = () => navigate(`${buildEventItemUrl(event)}/rediger`);

    if (!hasGroupAccess(user, UserGroup.Administrator) && user.userId !== event.createdByUserId) {
        return (
            <Tooltip title="Rediger">
                <IconButton onClick={onEditClick}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <IconPopupMenu icon={iconOrientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon />}>
            <MenuList style={{ minWidth: "180px" }} disablePadding>
                <MenuItem style={{ minHeight: "50px" }} divider={true} onClick={onEditClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                        Rediger
                    </ListItemText>
                </MenuItem>
                <MenuItem style={{ minHeight: "50px" }} sx={{ backgroundColor: "error" }} onClick={() => deleteEvent(event)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: "error" }}>
                        Slett
                    </ListItemText>
                </MenuItem>
            </MenuList>
        </IconPopupMenu>
    );
}
