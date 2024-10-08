import { Avatar, Skeleton } from "@mui/material"
import { useUserReference } from "src/context/UserReference"

export function UserAvatar({
    userId, style
}: {
    userId: number;
    style?: React.CSSProperties;
}) {

    const { isError, isPending, getUser } = useUserReference();

    if (isPending) {
        return <UserAvatarSkeleton style={style} />;
    }

    const user = isError ? undefined : getUser(userId);
    return (
        <Avatar
            style={{
                height: "40px",
                width: "40px",
                margin: 0,
                padding: 0,
                ...style
            }}
        >
            {user?.isDeleted === false ? user.initials : ""}
        </Avatar>
    );
}

export function UserAvatarSkeleton({ style }: { style?: React.CSSProperties} ) {
    return (
        <Skeleton
            variant="circular"
            style={{
                height: "40px",
                width: "44px",
                margin: 0,
                padding: 0,
                ...style
            }} />
    )
}

