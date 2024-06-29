import { Avatar, Link, Skeleton, Stack, useTheme } from "@mui/material"
import { UserIdentity } from "common/interfaces"
import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { UserAvatarSkeleton } from "./user/UserAvatar"

export function UserList( { 
    users,
    noUsersText,
    style,
    alternatingStyle
}: { 
    users: UserIdentity[],
    noUsersText?: string,
    style?: React.CSSProperties 
    alternatingStyle?: React.CSSProperties
}) {

    if(users.length === 0 && noUsersText) {
        return (
            <div style={{opacity: 0.75, paddingLeft: "6px" }}>
                {noUsersText}
            </div>
        )
    }

    return (
        <>
            {users.map((user, index) => (
                <UserStack
                    key={`userId: ${user.id}, index: ${index}`}
                    style={style}
                    alternatingStyle={alternatingStyle}
                    isAlternate={index % 2 === 1}
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
                </UserStack>
            ))}
        </>
    )
}

export function UserListSkeleton( {
    length = 5,
    style,
    alternatingStyle,
}: { 
    length?: number,
    style?: React.CSSProperties,
    alternatingStyle?: React.CSSProperties,
}) {
    return (
        <>
            {Array(length).fill(1).map((_, index) => (
                <UserStack
                    key={index}
                    style={style}
                    alternatingStyle={alternatingStyle}
                    isAlternate={index % 2 === 1}
                >
                    <UserAvatarSkeleton style={{width: "40px", height: "40px"}}/>
                    <Skeleton
                        variant="text"
                        style={{ width: "170px"}} 
                    />
                </UserStack>
            ))}
        </>
    )
}

function UserStack( {
    children, 
    style, 
    alternatingStyle, 
    isAlternate
}: {
    children?: React.ReactNode,
    style?: React.CSSProperties,
    alternatingStyle?: React.CSSProperties,
    isAlternate?: boolean
}) {
    const theme = useTheme()

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

    const selectedStyle = isAlternate ? defaultAnteratingStyle : defaultStyle

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{ 
                py: 1, 
            }}
            spacing={2}
            style={selectedStyle}
        >
            {children} 
        </Stack>   
    )
}