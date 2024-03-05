import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { LoadingButton } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControlLabel, FormGroup, Link, Paper, Radio, RadioGroup, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserGroup } from 'common/enums';
import { Poll, PollOption, PollWithOption } from "common/interfaces";
import { hasGroupAccess } from 'common/utils';
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthorInfo } from 'src/components/AuthorInfo';
import { DeleteMenuItem } from 'src/components/menu/EditOrDeleteMenu';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuthenticatedUser } from 'src/context/Authentication';
import { useTitle } from 'src/hooks/useTitle';
import { fetchFn } from "src/utils/fetchAsync";
import { postJson } from 'src/utils/postJson';
import { pollListQueryKey, usePolls } from './Context';
import { VoterListModal, buildUrlParams } from './components/VoterListModal';
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
        return <PollResult poll={poll} onExitResultClick={onExitResultClick}  />

    return <VoteForm 
        poll={poll} 
        onShowResultClick={onShowResultClick} 
        onSubmit={onSubmit}
        />
}

function VoteForm({
    poll,
    onShowResultClick,
    onSubmit,
}: {
    poll: PollWithOption,
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement>,
    onSubmit: (selectedItems: PollOption[]) => Promise<void>
}) {

    const [selectedItems, setSelectedItems] = useState<PollOption[]>(poll.options.filter(option => option.isVotedOnByUser))
    const [isLoading, setIsLoading] = useState(false)

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        await onSubmit(selectedItems)
        
        setIsLoading(false)
    }

    const onItemClicked = (item: PollOption, index: number) => {
        if(poll.type === "single") {
            setSelectedItems([item])
            return
        }

        const newItems = [...selectedItems]
        if(newItems.includes(item)) {
            newItems.splice(newItems.indexOf(item), 1)
        }
        else {
            newItems.push(item)
        }

        setSelectedItems(newItems)
    }

    return (
        <form onSubmit={onFormSubmit}>
            <OptionItemGroup 
                variant={poll.type} 
                style={{marginLeft: "5px"}}>
                {poll.options.map((option, index) => (
                    <OptionItem 
                        key={index}
                        value={index}
                        option={option}
                        variant={poll.type}
                        checked={selectedItems.includes(option)}
                        onClick={() => onItemClicked(option, index)}
                    />
                ))}
            </OptionItemGroup>
            <div style={{marginTop: "30px", marginBottom: "15px"}}>
                <SubmitButtons 
                    onShowResultClick={onShowResultClick} 
                    disabled={selectedItems.length <= 0} 
                    loading={isLoading} 
                />
            </div>
        </form>
    )
}

function OptionItemGroup( {children, variant, style}: {children: React.ReactNode, variant: "single" | "multiple", style?: React.CSSProperties}){
    if (variant === "single")  {
        return (
            <RadioGroup style={style}>
                {children}
            </RadioGroup>
        )
    }
    
    return (
        <FormGroup style={style}>
            {children}
        </FormGroup>
    )
}

function OptionItem({
    option, 
    value, 
    variant,
    onClick,
    checked
}: {
    option: PollOption, 
    value: unknown, 
    variant: "single" | "multiple",
    onClick?: React.MouseEventHandler<HTMLLabelElement>,
    checked?: boolean,
}) {

    const [isMouseOver, setIsMouseOver] = useState(false)

    const srcControl = variant === "single" 
        ? <Radio color="secondary" checked={checked} /> 
        : <Checkbox color="secondary" checked={checked} />

    const onControlClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault()
        if(onClick){
            onClick(e)
        }
    }

    return (
        <FormControlLabel 
            value={value}
            label={option.text}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            style={isMouseOver ? {textDecoration: "underline"} : {}}
            onClick={onControlClick}
            control={srcControl}
        />
    )
}

function SubmitButtons({
    onShowResultClick,
    loading,
    disabled
}: {
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement> | undefined
    loading: boolean,
    disabled: boolean,
}) {
    const isSmallScreen: boolean = useMediaQuery("(max-width: 360px)")

    const buttonSize = isSmallScreen ? "small" : "medium"

    const buttonMinWidth = isSmallScreen ? "112px" : "120px"
    const buttonStyle: React.CSSProperties = { minWidth: buttonMinWidth }

    return (
        <Stack direction="row" justifyContent="space-between">
            <LoadingButton
                type="submit"
                loading={loading}
                startIcon={<HowToVoteIcon />}
                variant="contained"
                size={buttonSize}
                disabled={disabled}
                style={buttonStyle}
            >
                Stem
            </LoadingButton>
            <Button
                startIcon={<BarChartIcon />}
                color="secondary"
                variant="outlined"
                size={buttonSize}
                disabled={loading}
                onClick={onShowResultClick}
                style={buttonStyle}
            >
                resultat
            </Button>
        </Stack>
    )
}

function PollResult( {poll, onExitResultClick}: {poll: PollWithOption, onExitResultClick: React.MouseEventHandler<HTMLButtonElement>}) {

    const userHasVoted = poll.options.find(option => option.isVotedOnByUser) !== undefined
    const totalVotes = poll.options.reduce((accumulated, option) => accumulated + option.voteCount, 0)

    return (
        <div>
            <div>
                {poll.options.map((option, index) => (
                    <PollResultItem 
                        key={index} 
                        pollId={poll.id}
                        option={option} 
                        totalVotes={totalVotes}
                        optionIndex={index}
                        style={{ 
                            marginBottom: "25px", 
                        }}
                    />
                ))}
            </div>
            <div style={{marginTop: "40px", marginBottom: "1em"}}>
                <Button 
                    variant="outlined"
                    color="secondary"
                    style={{minWidth: "120px"}}
                    startIcon={<HowToVoteIcon />}
                    onClick={onExitResultClick}
                    >
                        {userHasVoted ? "Endre stemme" : "Avgi stemme"}
                </Button>
            </div>
        </div>
    )
}

function PollResultItem( {
    pollId, 
    option, 
    totalVotes, 
    optionIndex,
    style,
}: {
    pollId: number, 
    option: PollOption, 
    totalVotes: number, 
    optionIndex: number,
    style?: React.CSSProperties,
}){
    const theme = useTheme()
    const percentage = totalVotes <= 0 ? 0 : option.voteCount / totalVotes * 100
    return (
        <div style={style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "2px",
            }}>
                <span style={{
                    marginLeft: "2px",
                    fontSize: "1.1em",
                }}>
                    {option.text}
                </span>
                {option.isVotedOnByUser && ( 
                    <HowToRegIcon 
                        style={{
                            color: theme.palette.primary.light, 
                            marginRight: "1px" 
                        }}/>
                )}
            </div>
            <BarChartItem 
                percentage={percentage} 
                voteCount={option.voteCount}
                voterListModalUrl={`?${buildUrlParams(pollId, optionIndex)}`}
                />
        </div>
    )
}

function BarChartItem( {
    percentage, 
    voteCount, 
    voterListModalUrl
}: {
    percentage: number, 
    voteCount: number, 
    voterListModalUrl: string
}){
    const theme = useTheme();
    let newPercentage =  Math.max(Math.min(Math.round(percentage), 100))  // Round value to nearest integer between 0 and 100
    return (
        <div style={{
            height: "40px",
            width: "100%",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.palette.grey[600],
            borderRadius: "4px",
            position: "relative",
        }}>
            <div style={{
                height: "100%",
                width: `${newPercentage}%`,
                backgroundColor: theme.palette.primary.light,
                borderRadius: "3px",
            }}>
            </div>
            <div style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: "10px",
                fontWeight: "bold",
                color: theme.palette.text.secondary,
                fontSize: "1.1em"
            }}>
                {newPercentage}%
            </div>
            <div style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "10px",
                fontSize: "small",
                fontWeight: "light",
                color: theme.palette.text.secondary,
            }}>
                <Link
                    underline='hover'
                    color="secondary"
                    to={voterListModalUrl}
                    component={RouterLink}
                >
                    {voteCount} {voteCount === 1 ? "stemme" : "stemmer"}
                </Link>
            </div>
        </div>
    )
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