import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EventData } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "src/context/Authentication";
import { UserGroup } from "common/enums";
import { buildEventItemUrl } from "../Context";
import { deleteEvent } from "../ListPage";
import { EditOrDeleteMenu } from "src/components/menu/EditOrDeleteMenu";


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
        <EditOrDeleteMenu 
            iconOrientation={iconOrientation}
            onDeleteClick={() => deleteEvent(event)}
            onEditClick={onEditClick}
        />
    )
}


