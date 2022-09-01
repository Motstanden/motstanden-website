import React, { useRef, useState } from 'react';

// Material UI
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';

import { getFullName } from 'common/utils';
import { Divider, Link } from '@mui/material';
import { IconPopupMenu } from 'src/components/IconPopupMenu';


export default function UserAvatar() {
    let auth = useAuth()
    
    let navigate = useNavigate()
    const onSignOutClick = async () => {
        let success = await auth.signOut();
        if(success) {
            navigate("/") 
        }
    }

    const onSignOutAllClick = async () => {
        if(window.confirm("Du vil bli logget ut av alle enheter innen 15 minutter")){ 
            const success = await auth.signOutAllUnits()
            if(success) {
                navigate("/") 
            }
        }
    }

    const user = auth.user!
    const fullName = getFullName(user)
    return (
        <IconPopupMenu 
            icon={(
                <Tooltip title={fullName}>
                    <Avatar alt={`Profilbilde for ${fullName}`} src={user.profilePicture}>{user.firstName[0]}</Avatar>
                </Tooltip>
            )}
        >
            <MenuItem component={RouterLink} to={`/medlem/${user.userId}`}>
                Profil
            </MenuItem>
            <Divider/>
            <MenuItem onClick={onSignOutClick}>
                Logg ut
            </MenuItem>
            <Divider/>
            <MenuItem onClick={onSignOutAllClick} >
                Logg ut alle enheter
            </MenuItem>
        </IconPopupMenu>
    )
}
