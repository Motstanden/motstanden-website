
// Material UI
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';


import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';

import { Divider } from '@mui/material';
import { getFullName } from 'common/utils';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';


export default function UserAvatar() {
    const auth = useAuth()

    const navigate = useNavigate()
    const onSignOutClick = async () => {
        const success = await auth.signOut();
        if (success) {
            navigate("/")
        }
    }

    const onSignOutAllClick = async () => {
        if (window.confirm("Du vil bli logget ut av alle enheter innen 15 minutter")) {
            const success = await auth.signOutAllUnits()
            if (success) {
                navigate("/")
            }
        }
    }

    const user = auth.user!
    const fullName = getFullName(user)
    return (
        <IconPopupMenu
            icon={(
                <Tooltip title={fullName} disableInteractive>
                    <Avatar aria-label="Profilmeny" alt="Mitt profilbilde" src={user.profilePicture}>{user.firstName[0]}</Avatar>
                </Tooltip>
            )}
        >
            <MenuItem component={RouterLink} to={`/medlem/${user.userId}`} >
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
