import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Tooltip
} from "@mui/material";
import { getFullName } from 'common/utils';
import { Link as RouterLink } from 'react-router-dom';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuthenticatedUser } from 'src/context/Authentication';
import { useAppBarIconSize } from '../useAppSizes';


export default function UserAvatar() {
    const { buttonSize } = useAppBarIconSize()
    
    const { user, signOut, signOutAllDevices} = useAuthenticatedUser()

    const onSignOutClick = async () => {
        await signOut();
    }

    const onSignOutAllClick = async () => {
        if (window.confirm("Du vil bli logget ut av alle enheter innen 15 minutter")) {
            await signOutAllDevices()
        }
    }

    return (
        <IconPopupMenu
            ariaLabel="Profilmeny" 
            style={{
                padding: "0px",
                color: "inherit",
            }}
            icon={(
                <Tooltip title={getFullName(user)} disableInteractive>
                    <div style={{position: "relative"}}>

                            <Avatar 
                                src={`/${user.profilePicture}`}
                                alt="Mitt profilbilde" 
                                sx={{
                                    height: buttonSize, 
                                    width: buttonSize,
                                }}>
                                {user.firstName[0]}
                            </Avatar>
                        
                        {/* The sole purpose of this box is to create a white overlay over the avatar when it is hovered. */}
                        <Box sx={{
                            backgroundColor: "white",
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            borderRadius: "50%",
                            opacity: 0,
                            ":hover": {
                                opacity: 0.1
                            }
                        }}/>

                    </div>
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
