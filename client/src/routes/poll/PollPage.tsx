import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Paper, Stack, useTheme } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserGroup } from 'common/enums';
import { Poll, PollOption, PollWithOption } from "common/interfaces";
import { hasGroupAccess } from 'common/utils';
import React, { useState } from "react";
import { AuthorInfo } from 'src/components/AuthorInfo';
import { DeleteMenuItem } from 'src/components/menu/EditOrDeleteMenu';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuthenticatedUser } from 'src/context/Authentication';
import { useTitle } from 'src/hooks/useTitle';
import { fetchFn } from "src/utils/fetchAsync";
import { postJson } from 'src/utils/postJson';
import { pollListQueryKey, usePolls } from './Context';
import { VoteForm } from './components/VoteForm';
import { PollResult } from './components/PollResult';
import { VoterListModal } from './components/VoterListModal';
import { PollCardSkeleton } from "./skeleton/PollCard";
import { PollOptionsSkeleton } from './skeleton/PollOptions';

export default function PollPage(){
    useTitle("Avstemninger")
    const {currentPoll, remainingPolls} = usePolls()

    if(currentPoll === undefined)
        return <div style={{marginBlock: "40px", opacity: 0.8}}>Ingen avsteminger funnet...</div>

    return(
        <div>
            <h1>Avstemning</h1>
            <div style={{
                    display: "inline-block",
                    minWidth: "MIN(100%, 500px)"
                }}>
                <PollCard poll={currentPoll} srcQueryKey={pollListQueryKey}/>
            </div>

            {/* This comment section is coming soon™ */}
            {/* <Divider sx={{ my: 4 }} />
            <CommentSection 
                entityType={CommentEntityType.Poll}
                entityId={currentPoll.id}            
            />
            <Divider sx={{ my: 4 }} /> */}
            
            <PreviousPolls polls={remainingPolls}/>
        </div>
    )
}

export function PollCard( { poll, srcQueryKey, style, }: { poll: Poll, srcQueryKey: any[], style?: React.CSSProperties }){

    const { user } = useAuthenticatedUser()
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()

    const canDeletePoll = user.id === poll.createdBy || hasGroupAccess(user, UserGroup.Administrator)

    const onDeleteClick = async () => {
        setIsLoading(true)
        const response = await postJson(
            "/api/polls/delete",
            { id: poll.id },
            {
                alertOnFailure: true,
                confirmText: "Vil du permanent slette denne avstemningen?"
            }
        )
        if(response?.ok) {
            await queryClient.invalidateQueries({queryKey: srcQueryKey})
        }
        setIsLoading(false)
     }

    if(isLoading)
        return <PollCardSkeleton/>

    return(
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
                    <div style={{marginRight: "-10px"}}>
                        <PollMenu onDeleteClick={onDeleteClick}/>
                    </div>
                )}
            </Stack> 
            <Divider sx={{mt: 1}}/>
            <PollContent poll={poll}/>
        </Paper>
    )
}

function PreviousPolls( {polls}: { polls: Poll[] }) {
    const theme = useTheme()

    if(polls.length <= 0)
        return <></>

    return (
        <>
            <h2>Tidligere avstemninger</h2>
            {polls.map((poll) => (
                <div key={poll.id}  >
                    <Accordion
                        disableGutters
                        elevation={0}
                        style={{ 
                            display: "inline-block",
                            minWidth: "MIN(100%, 500px)",
                            borderBottomWidth: "0px",
                            borderBottomStyle: "solid",
                            backgroundColor: "transparent",
                            borderRadius: "0px",
                        }}
                        >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            style={{
                                backgroundColor: "transparent",
                                flexDirection: "row-reverse", 
                                padding: "0px",
                                margin: "0px",
                                fontSize: "large",
                                fontWeight: "bold",
                            }}
                        >
                            <span style={{marginLeft: "10px"}}>
                                {poll.title}
                            </span>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                borderLeftWidth: "1px",
                                borderLeftStyle: "solid",
                                borderLeftColor: theme.palette.divider,
                                padding: "0px 10px 20px 30px",
                                marginLeft: "12px"
                            }}
                        >
                            <PollContent poll={poll}/>
                        </AccordionDetails>
                    </Accordion>
                </div>
            ))}
        </>
    )
}

function PollContent( {poll }: {poll: Poll }) {
    return (
        <div>
            <div style={{
                marginBottom: "15px",
            }}>
                <AuthorInfo 
                    createdAt={poll.createdAt}
                    createdByUserId={poll.createdBy}
                    updatedAt={poll.updatedAt}
                    updatedByUserId={poll.updatedBy}
                />
            </div>
            <PollOptions poll={poll}/>
        </div>
    )
}

function PollOptions( {poll }: {poll: Poll }) {
    const queryKey = [ poll.id, "FetchPollOptions"]
    
    const {isPending, isError, data, error} = useQuery<PollOption[]>({
        queryKey: queryKey,
        queryFn: fetchFn<PollOption[]>(`/api/polls/${poll.id}/options`),
    })
    
    const queryClient = useQueryClient()
    const onSubmitSuccess = async () => await queryClient.invalidateQueries({queryKey: queryKey})

    if(isPending)
        return <PollOptionsSkeleton/>

    if(isError)
        return <div style={{minHeight: "300px"}}>{`${error}`}</div>

    const pollData: PollWithOption = {
        ...poll,
        options: data
    }

    return (
        <>
            <PollOptionsRenderer poll={pollData} onSubmitSuccess={onSubmitSuccess}/>
            <VoterListModal poll={pollData}/>
        </>

    ) 
}

function PollOptionsRenderer( {
    poll, 
    onSubmitSuccess, 
}: {
    poll: PollWithOption, 
    onSubmitSuccess: () => Promise<void>, 
}) {
    const [showResult, setShowResult] = useState(poll.options.find(option => option.isVotedOnByUser) !== undefined) 

    const onShowResultClick = () => setShowResult(true)
    const onExitResultClick = () => setShowResult(false)

    const onSubmit = async (selectedItems: PollOption[]) => { 

        const url = `/api/polls/${poll.id}/vote/upsert`
        const optionIds: number[] = selectedItems.map(item => item.id)

        const response = await postJson(url, optionIds, { alertOnFailure: true})

        if(response && response.ok)
        {
            await onSubmitSuccess()
            setShowResult(true)
        }
    }

    if(showResult)
        return <PollResult poll={poll} onChangeVoteClick={onExitResultClick}  />

    return <VoteForm 
        poll={poll} 
        onShowResultClick={onShowResultClick} 
        onSubmit={onSubmit}
        />
}

function PollMenu({
    onDeleteClick,
}: {
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>,
}) {
    return (
        <IconPopupMenu icon={<MoreHorizIcon/>} ariaLabel='Avstemningmeny'>
            <DeleteMenuItem onClick={onDeleteClick} />
        </IconPopupMenu>    
    )
}