import { Avatar, Link, Stack, useTheme } from "@mui/material";
import { UserReference } from "common/interfaces";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

export function UserList( { 
    users,
    noUsersText,
    style,
    alternatingStyle
}: { 
    users: UserReference[],
    noUsersText?: string,
    style?: React.CSSProperties 
    alternatingStyle?: React.CSSProperties
}) {
    const theme = useTheme()

    if(users.length === 0 && noUsersText) {
        return (
            <div style={{opacity: 0.75, paddingLeft: "6px" }}>
                {noUsersText}
            </div>
        )
    }

    const defaultStyle: React.CSSProperties = { 
        borderRadius: "7px",
        paddingLeft: "10px",
        ...style
    }

    const defaultAnteratingStyle: React.CSSProperties = {
        backgroundColor: theme.palette.action.hover,
        ...defaultStyle,
        ...alternatingStyle   
    }

    return (
        <>
            {users.map((user, index) => (
                <Stack
                    key={user.id}
                    direction="row"
                    alignItems="center"
                    sx={{ 
                        py: 1, 
                    }}
                    spacing={2}
                    style={index % 2 === 0 ? defaultStyle : defaultAnteratingStyle}
                >
                    <Avatar>{user.initials}</Avatar>
                    <Link
                        color="secondary"
                        component={RouterLink}
                        to={`/medlem/${user.id}`}
                        underline="hover"
                    >
                        {user.fullName}
                    </Link>
                </Stack>
            ))}
        </>
    )
}