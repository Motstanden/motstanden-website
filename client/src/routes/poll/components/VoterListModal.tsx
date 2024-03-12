import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Theme, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PollOptionVoters, PollWithOption } from "common/interfaces";
import { strToNumber } from 'common/utils';
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CloseModalButton } from 'src/components/CloseModalButton';
import { UserList, UserListSkeleton } from 'src/components/UserList';
import { fetchFn } from "src/utils/fetchAsync";

const voterParams = {
    pollId: "poll-id",
    optionIndex: "option-index"
};

export function buildUrlParams(pollId: number, optionIndex: number) {
    return `${voterParams.pollId}=${pollId}&${voterParams.optionIndex}=${optionIndex}`
}

export function VoterListModal({ poll }: { poll: PollWithOption; }) {

    const [searchParams, setSearchParams] = useSearchParams();

    // You may wonder why this is a state variable, and not a normal variable that is derived from the searchParams.
    // The reason is that when we want to close the modal we want to remove the optionIndex from the url, but we don't want to re-render the modal.
    // If we were to use a normal variable, the content in the modal will have time to re-render, 
    // which furthermore will cause a slightly noticeable flicker in the exit animation.  
    const [optionIndex, setOptionIndex] = useState<number>(0);

    useEffect(() => {
        const newOptionIndex = strToNumber(searchParams.get(voterParams.optionIndex) ?? undefined);
        if (newOptionIndex !== undefined && newOptionIndex !== optionIndex) {
            setOptionIndex(newOptionIndex);
        }
    }, [searchParams]);

    const onClose = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(voterParams.pollId);
        newParams.delete(voterParams.optionIndex);
        setSearchParams(newParams);
    };

    const onNavigateLeft = () => {
        const nextIndex = (optionIndex - 1 + poll.options.length) % poll.options.length;
        setOptionUrl(nextIndex);
    };

    const onNavigateRight = () => {
        const nextIndex = (optionIndex + 1) % (poll.options.length);
        setOptionUrl(nextIndex);
    };

    const setOptionUrl = (index: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(voterParams.optionIndex, `${index}`);
        setSearchParams(newParams, { replace: true });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") {
            onNavigateRight();
        } else if (e.key === "ArrowLeft") {
            onNavigateLeft();
        }
    };

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const pollId = strToNumber(searchParams.get(voterParams.pollId));
    
    const selectedIndex = poll.options.length > 0 
        ? optionIndex % poll.options.length
        : undefined
    const selectedOption = selectedIndex !== undefined
        ? poll.options[selectedIndex]
        : undefined
    
    const isOpen = pollId === poll.id && selectedIndex !== undefined && selectedOption !== undefined;
    
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            scroll="paper"
            fullWidth
            fullScreen={isSmallScreen}
            onKeyDown={onKeyDown}
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <h3 style={{ margin: "0px" }}>
                        {poll.title}
                    </h3>
                    <CloseModalButton onClick={onClose} style={{ marginBottom: "2px" }} />
                </Stack>

                <Divider sx={{ pt: 2 }} />
            </DialogTitle>
                <DialogContent style={{ height: isSmallScreen ? undefined : "70vh" }}>
                {isOpen && (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                        >
                            <h3 style={{ marginTop: "5px", marginBottom: "20px", marginInline: "5px" }}>
                                {selectedOption.text}
                            </h3>
                            <NavigationButtons
                                onLeftClick={onNavigateLeft}
                                onRightClick={onNavigateRight}
                                currentIndex={selectedIndex + 1}
                                maxIndex={poll.options.length} />
                        </Stack>
                        <VoterListLoader
                            poll={poll}
                            selectedOptionId={selectedOption.id} />
                    </>
                )}
                </DialogContent>
        </Dialog>
    );
}

function VoterListLoader({ poll, selectedOptionId }: { poll: PollWithOption; selectedOptionId: number; }) {

    const { isPending, isError, data, error } = useQuery<PollOptionVoters[]>({
        queryKey: ["FetchPollVoters", poll.id],
        queryFn: fetchFn<PollOptionVoters[]>(`/api/polls/${poll.id}/voter-list`),
    });

    if (isPending)
        return <UserListSkeleton />;

    if (isError)
        return <div>{`${error}`}</div>;

    const selectedData = data?.find(voter => voter.optionId === selectedOptionId)
        ?? { optionId: selectedOptionId, voters: [] };

    return (
        <UserList users={selectedData.voters} noUsersText="Ingen har stemt på dette..." />
    );
}

function NavigationButtons({
    onLeftClick, onRightClick, currentIndex, maxIndex,
}: {
    onLeftClick?: VoidFunction;
    onRightClick?: VoidFunction;
    currentIndex: number;
    maxIndex: number;
}) {
    return (
        <div style={{ whiteSpace: "nowrap" }}>
            <IconButton onClick={onLeftClick}>
                <KeyboardArrowLeftIcon />
            </IconButton>
            <span style={{
                fontSize: "x-small",
                opacity: 0.5,
                paddingInline: "2px",
            }}>
                {currentIndex}/{maxIndex}
            </span>
            <IconButton onClick={onRightClick}>
                <KeyboardArrowRightIcon />
            </IconButton>
        </div>
    );
}
