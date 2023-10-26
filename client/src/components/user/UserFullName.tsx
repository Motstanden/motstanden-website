import { Link, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useUserReference } from "src/context/UserReference";


export function UserFullName({
    userId, style
}: {
    userId: number;
    style?: React.CSSProperties;
}) {

    const { isError, isLoading, userReference } = useUserReference();

    if (isLoading) {
        return (
            <Skeleton
                variant="text"
                style={{
                    width: "150px",
                    margin: 0,
                    padding: 0,
                    ...style
                }} />
        );
    }

    const user = userReference[userId];
    if (isError || !user) {
        return <b>[Ukjent]</b>;
    }

    return (
        <Link
            component={RouterLink}
            to={`/medlem/${userId}`}
            underline="hover"
            style={{
                wordWrap: "break-word",
                fontSize: "inherit",
                color: "inherit",
                textDecorationColor: "inherit",
                fontWeight: "bold",
                ...style
            }}
        >
            {user.fullName}
        </Link>
    );
}
