import { Divider, Paper, Skeleton } from "@mui/material";
import React from "react";
import { PollOptionsSkeleton } from "./PollOptions";

export { PollCard as PollCardSkeleton };

function PollCard({ style }: { style?: React.CSSProperties; }) {
    return (
        <Paper elevation={2} sx={{ p: 2 }} style={style}>
            <Skeleton
                variant="text"
                height="45px"
                width="MIN(320px, 100%)" />
            <Divider sx={{ mt: 1 }} />
            <PollOptionsSkeleton length={3} />
        </Paper>
    );
}


