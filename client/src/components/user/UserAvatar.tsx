import { Avatar, Skeleton } from "@mui/material";
import { useUserReference } from "src/context/UserReference";

export function UserAvatar({
    userId, style
}: {
    userId: number;
    style?: React.CSSProperties;
}) {

    const { isError, isLoading, userReference } = useUserReference();

    if (isLoading) {
        return <UserAvatarSkeleton style={style} />;
    }

    const user = userReference[userId];
    if (isError || !user) {
        return <Avatar style={style} />;
    }

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
            {user.initials}
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

