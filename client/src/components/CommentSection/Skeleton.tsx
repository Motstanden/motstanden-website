import { Skeleton, Stack } from "@mui/material";
import { UserAvatarSkeleton } from '../user/UserAvatar';
import { CommentSectionVariant } from "./CommentSection";


export function CommentSectionSkeleton({
    variant,
}: {
    variant?: CommentSectionVariant;
}) {
    const length = variant === "normal" ? 4 : 2;
    return (
        <div style={{ maxWidth: "700px" }}>
            {Array(length).fill(1).map((_, i) => (
                <CommentItemSkeleton key={i} variant={variant} />
            ))}
        </div>
    );
}
function CommentItemSkeleton({ variant }: { variant?: CommentSectionVariant; }) {

    const commentBubbleStyle: React.CSSProperties = variant === "normal" ? {
        height: "70px",
        borderRadius: "10px",
    } : {
        height: "60px",
        borderRadius: "16px",
    };

    return (
        <Stack
            direction="row"
            spacing={variant === "normal" ? 2 : 1}
            marginBottom="15px"
        >
            <UserAvatarSkeleton style={{ marginTop: "5px" }} />
            <div
                style={{
                    width: "100%",
                }}>
                <Skeleton
                    variant="rounded"
                    height="70px"
                    style={{
                        ...commentBubbleStyle
                    }} />
                <Skeleton
                    variant="text"
                    style={{
                        marginLeft: "5px",
                        maxWidth: "100px",
                        fontSize: "small"
                    }} />
            </div>
        </Stack>
    );
}
