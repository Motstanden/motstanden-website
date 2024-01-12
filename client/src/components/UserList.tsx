import { Avatar, Link, Stack } from "@mui/material";
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

    if(users.length === 0 && noUsersText) {
        return (
            <p style={{opacity: 0.75 }}>
                {noUsersText}
            </p>
        )
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
                        pl: 1 
                    }}
                    spacing={2}
                    style={index % 2 === 1 ? { ...style, ...alternatingStyle } : style}
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