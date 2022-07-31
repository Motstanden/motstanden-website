import React, { useRef, useState } from 'react';

// Material UI
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';

import BoyAvatarImg from "../../assets/pictures/loginAvatar/boy1.png"
import GirlAvatarImg from "../../assets/pictures/loginAvatar/girl1.png"


export default function UserAvatar() {
    let auth = useAuth()
    let username = auth?.user ?? ""

    let [avatarSrc, setAvatarSrc] = useState<string>(Math.random() >= 0.5 ? BoyAvatarImg : GirlAvatarImg)

    let navigate = useNavigate()
    const onSignOutClick = async () => {
        let success = await auth.signOut();
        if(success) {
            navigate("/") 
        }
    }

    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    return (
        <>
        <Tooltip title={username}>
            <IconButton ref={anchorEl} onClick={() => setIsOpen(!isOpen)}>
                <Avatar alt={username} src={avatarSrc}/>
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