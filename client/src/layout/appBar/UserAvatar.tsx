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


export default function UserAvatar() {
    let auth = useAuth()
    
    let navigate = useNavigate()
    const onSignOutClick = async () => {
        let success = await auth.signOut();
        if(success) {
            navigate("/") 
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
                <Avatar alt={`Profilbilde for ${fullName}`} src={user.profilePicture}>{fullName}</Avatar>
            </IconButton>
        </Tooltip>
        <Menu 
            anchorEl={anchorEl.current}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={onSignOutClick}>
                Logg ut
            </MenuItem>
        </Menu>
        </>
    )
}