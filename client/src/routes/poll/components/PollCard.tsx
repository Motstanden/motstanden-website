import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Divider, Paper, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { UserGroup } from 'common/enums';
import { Poll } from "common/interfaces";
import { hasGroupAccess } from 'common/utils';
import React, { useState } from "react";
import { DeleteMenuItem } from 'src/components/menu/EditOrDeleteMenu';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuthenticatedUser } from 'src/context/Authentication';
import { postJson } from 'src/utils/postJson';
import { PollCardSkeleton } from "../skeleton/PollCard";
import { PollContent } from './PollContent';

export function PollCard({ poll, srcQueryKey, style, }: { poll: Poll; srcQueryKey: any[]; style?: React.CSSProperties; }) {

    const { user } = useAuthenticatedUser();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const canDeletePoll = user.id === poll.createdBy || hasGroupAccess(user, UserGroup.Administrator);

    const onDeleteClick = async () => {
        setIsLoading(true);
        const response = await postJson(
            "/api/polls/delete",
            { id: poll.id },
            {
                alertOnFailure: true,
                confirmText: "Vil du permanent slette denne avstemningen?"
            }
        );
        if (response?.ok) {
            await queryClient.invalidateQueries({ queryKey: srcQueryKey });
        }
        setIsLoading(false);
    };

    if (isLoading)
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
                {canDeletePoll && (
                    <div style={{ marginRight: "-10px" }}>
                        <PollMenu onDeleteClick={onDeleteClick} />
                    </div>
                )}
            </Stack>
            <Divider sx={{ mt: 1 }} />
            <PollContent poll={poll} />
        </Paper>
    );
}

function PollMenu({
    onDeleteClick,
}: {
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>;
}) {
    return (
        <IconPopupMenu icon={<MoreHorizIcon />} ariaLabel='Avstemningmeny'>
            <DeleteMenuItem onClick={onDeleteClick} />
        </IconPopupMenu>
    );
}
