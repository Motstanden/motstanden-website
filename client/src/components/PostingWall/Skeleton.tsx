import { Divider, Paper, Skeleton, Stack, Theme, useMediaQuery, useTheme } from "@mui/material";
import { CommentSectionSkeleton } from "src/components/CommentSection";
import { LikeButtonSkeleton } from '../likes/LikeButton';
import { LikeListSkeleton } from './PostingWall';


export function PostListSkeleton({ length }: { length: number; }) {
    return (
        <>
            {Array(length).fill(1).map((_, index) => (
                <PostItemSkeleton
                    key={index}
                    style={{
                        marginBottom: "20px"
                    }} />

            ))}
        </>
    );
}

function PostItemSkeleton({
    style
}: {
    style?: React.CSSProperties;
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Paper
            elevation={2}
            style={{
                paddingBlock: "20px",
                paddingInline: isSmallScreen ? "10px" : "20px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                ...style
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                <Skeleton
                    variant="circular"
                    height="40px"
                    width="40px" />
                <div>
                    <Skeleton
                        variant="text"
                        style={{
                            width: "150px",
                        }} />
                    <Skeleton
                        variant="text"
                        style={{
                            width: "100px",
                            fontSize: "small"
                        }} />
                </div>
            </Stack>
            <Skeleton
                variant="rounded"
                style={{
                    marginTop: "15px",
                    height: "80px",
                    marginBottom: "15px"
                }} />
            <Stack direction="row" justifyContent="space-between">
                <LikeButtonSkeleton />
                <LikeListSkeleton />
            </Stack>

            <Divider sx={{ mb: 3, mt: 1 }} />
            <CommentSectionSkeleton variant="compact" />
        </Paper>
    );
}
