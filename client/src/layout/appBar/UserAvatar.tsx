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
import ListItemLink from './ListItemLink';


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

    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    const user = auth.user!
    const fullName = getFullName(user)
    return (
        <>
        <Tooltip title={fullName}>
            <IconButton ref={anchorEl} onClick={() => setIsOpen(!isOpen)}>
                <Avatar alt={`Profilbilde for ${fullName}`} src={user.profilePicture}>{user.firstName[0]}</Avatar>
            </IconButton>
        </Tooltip>
        <Menu 
            anchorEl={anchorEl.current}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem 
                component={RouterLink} 
                to={`/medlem/${user.userId}`} 
                onClick={() => setIsOpen(false)}
            >
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
        </Menu>
        </>
    )
}