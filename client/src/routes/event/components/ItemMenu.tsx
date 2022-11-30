import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from "@mui/material";
import { UserGroup } from "common/enums";
import { EventData } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import { useNavigate } from "react-router-dom";
import { EditOrDeleteMenu } from "src/components/menu/EditOrDeleteMenu";
import { useAuth } from "src/context/Authentication";
import { postJson } from 'src/utils/postJson';
import { buildEventItemUrl } from "../Context";


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
            ariaLabel="Arrangementmeny"
            onDeleteClick={() => deleteEvent(event)}
            onEditClick={onEditClick}
        />
    )
}

async function deleteEvent(event: EventData) {
    const response = await postJson(
        "/api/events/delete",
        { eventId: event.eventId },
        {
            confirmText: `Vil du permanent slette:\n«${event.title}»`,
            alertOnFailure: true
        }
    )
}
