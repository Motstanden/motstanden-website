
// Material UI
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Tooltip
} from "@mui/material";

import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';

import { getFullName } from 'common/utils';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';


export default function UserAvatar() {
    const auth = useAuth()

    const onSignOutClick = async () => {
        await auth.signOut();
    }

    const onSignOutAllClick = async () => {
        if (window.confirm("Du vil bli logget ut av alle enheter innen 15 minutter")) {
            await auth.signOutAllUnits()
        }
    }

    const user = auth.user!
    const fullName = getFullName(user)
    return (
        <IconPopupMenu
            icon={(
                <Tooltip title={fullName} disableInteractive>
                    <Avatar aria-label="Profilmeny" alt="Mitt profilbilde" src={`/${user.profilePicture}`}>{user.firstName[0]}</Avatar>
                </Tooltip>
            )}
        >
            <MenuItem component={RouterLink} to={`/medlem/${user.id}`} >
                <ListItemIcon><PersonIcon /></ListItemIcon>
                Profil
            </MenuItem>
            <Divider />
            <MenuItem onClick={onSignOutClick}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                Logg ut
            </MenuItem>
            <Divider />
            <MenuItem onClick={onSignOutAllClick}>
                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ color: "error" }}>Logg ut alle enheter</ListItemText>
            </MenuItem>
        </IconPopupMenu>
    )
}
