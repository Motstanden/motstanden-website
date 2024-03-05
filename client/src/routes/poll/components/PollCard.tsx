import { Divider, Paper, Stack } from "@mui/material";
import { Poll } from "common/interfaces";
import React from "react";
import { PollCardSkeleton } from "../skeleton/PollCard";
import { PollContent } from './PollContent';
import { PollMenu } from './PollMenu';
import { useDeletePollFunction } from "./useDeletePollFunction";

export function PollCard({ poll, srcQueryKey, style, }: { poll: Poll; srcQueryKey: any[]; style?: React.CSSProperties; }) {

    const { isDeleting, deletePoll } = useDeletePollFunction(poll, srcQueryKey);

    if (isDeleting)
        return <PollCardSkeleton />;

    return (
        <Paper
            elevation={6}
            sx={{ p: 2 }}
            style={style}>
            <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <h3 style={{ margin: 0 }}>
                    {poll.title}
                </h3>
                <div style={{ marginRight: "-10px" }}>
                    <PollMenu onDeleteClick={deletePoll} poll={poll} />
                </div>
            </Stack>
            <Divider sx={{ mt: 1 }} />
            <PollContent poll={poll} />
        </Paper>
    );
}

